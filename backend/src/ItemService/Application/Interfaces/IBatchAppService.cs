using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ItemService.DTOs;
using Shared.Models;

namespace ItemService.Application.Interfaces;

public interface IBatchAppService
{
    Task<ApiResponse<PagedList<Batch>>> GetBatchesAsync(PaginationRequest request);
    Task<ApiResponse<Batch>> GetBatchByIdAsync(string id);
    Task<ApiResponse<Batch>> CreateBatchAsync(string clientId, string uploadedBy, string description, List<CreateItemRequest> items);
    Task<ApiResponse<Batch>> ProcessBatchUploadAsync(BatchUploadRequest request);
    Task<ApiResponse<PagedList<Item>>> GetBatchItemsAsync(string batchId, PaginationRequest request);
}