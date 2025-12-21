using ItemService.Domain.Interfaces;
using ItemService.DTOs;
using ItemService.Application.Interfaces;
using Shared.Models;
using Shared.Services;
using Shared.Messages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace ItemService.Application.Services;

public class BatchAppService : IBatchAppService
{
    private readonly IItemUnitOfWork _unitOfWork;
    private readonly IKafkaService _kafkaService;

    public BatchAppService(IItemUnitOfWork unitOfWork, IKafkaService kafkaService)
    {
        _unitOfWork = unitOfWork;
        _kafkaService = kafkaService;
    }

    public async Task<ApiResponse<PagedList<Batch>>> GetBatchesAsync(PaginationRequest request)
    {
        var batches = await _unitOfWork.Batches.GetPagedAsync(request);
        return new ApiResponse<PagedList<Batch>>(batches, "Batches retrieved successfully");
    }

    public async Task<ApiResponse<Batch>> GetBatchByIdAsync(string id)
    {
        var batch = await _unitOfWork.Batches.GetByIdAsync(id);
        if (batch == null)
            throw new AppException(HttpStatusCode.NotFound, "Batch not found");

        return new ApiResponse<Batch>(batch);
    }

    public async Task<ApiResponse<Batch>> ProcessBatchUploadAsync(BatchUploadRequest request)
    {
        if (request.File == null || request.File.Length == 0)
        {
            throw new AppException(HttpStatusCode.BadRequest, "No file uploaded");
        }

        var items = new List<CreateItemRequest>();
        
        try
        {
            using var reader = new StreamReader(request.File.OpenReadStream());
            var content = await reader.ReadToEndAsync();
            
            // Parse CSV content - simplified implementation
            var lines = content.Split('\n', StringSplitOptions.RemoveEmptyEntries);
            
            // Skip header row if exists
            for (int i = 1; i < lines.Length; i++)
            {
                var columns = lines[i].Split(',');
                if (columns.Length >= 6)
                {
                    items.Add(new CreateItemRequest
                    {
                        ApplicantName = columns[0].Trim(),
                        ApplicantPhone = columns[1].Trim(),
                        ApplicantEmail = columns[2].Trim(),
                        DeliveryAddress = columns[3].Trim(),
                        State = columns[4].Trim(),
                        Lga = columns[5].Trim()
                    });
                }
            }
            
            if (items.Count == 0)
            {
                throw new AppException(HttpStatusCode.BadRequest, "No valid items found in file");
            }
        }
        catch (Exception ex) when (!(ex is AppException))
        {
            throw new AppException(HttpStatusCode.BadRequest, "Failed to process file: " + ex.Message);
        }

        return await CreateBatchAsync(request.ClientId, request.UploadedBy, request.Description, items);
    }

    public async Task<ApiResponse<Batch>> CreateBatchAsync(string clientId, string uploadedBy, string description, List<CreateItemRequest> items)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var batch = new Batch
            {
                Id = Guid.NewGuid().ToString(),
                BatchNumber = $"BATCH-{DateTime.UtcNow:yyyy-MM-dd}-{Random.Shared.Next(1000, 9999)}",
                ClientId = clientId,
                TotalItems = items.Count,
                UploadedAt = DateTime.UtcNow,
                UploadedBy = uploadedBy,
                Status = "processing",
                Description = description
            };

            await _unitOfWork.Batches.AddAsync(batch);

            foreach (var itemRequest in items)
            {
                var item = new Item
                {
                    Id = Guid.NewGuid().ToString(),
                    BatchId = batch.Id,
                    ItemNumber = $"CB-{DateTime.UtcNow:yyyy}-{Random.Shared.Next(100000, 999999):D6}",
                    QrCode = $"QR-CB-{DateTime.UtcNow:yyyy}-{Random.Shared.Next(100000, 999999):D6}",
                    ApplicantName = itemRequest.ApplicantName,
                    ApplicantPhone = itemRequest.ApplicantPhone,
                    ApplicantEmail = itemRequest.ApplicantEmail,
                    DeliveryAddress = itemRequest.DeliveryAddress,
                    State = itemRequest.State,
                    Lga = itemRequest.Lga,
                    Status = ItemStatus.Received,
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.Items.AddAsync(item);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            await _kafkaService.PublishAsync("batch-uploaded", new BatchUploadedEvent
            {
                BatchId = batch.Id,
                ClientId = batch.ClientId,
                TotalItems = batch.TotalItems,
                UploadedAt = batch.UploadedAt
            });

        return new ApiResponse<Batch>(batch, "Batch created successfully");
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw new AppException(HttpStatusCode.InternalServerError, "Failed to create batch", ex.Message);
        }
    }

    public async Task<ApiResponse<PagedList<Item>>> GetBatchItemsAsync(string batchId, PaginationRequest request)
    {
        var items = await _unitOfWork.Items.GetPagedByBatchIdAsync(batchId, request);
        return new ApiResponse<PagedList<Item>>(items, "Batch items retrieved successfully");
    }
}