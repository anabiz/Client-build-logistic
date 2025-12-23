using Microsoft.AspNetCore.Mvc;
using ItemService.Application.Interfaces;
using ItemService.DTOs;
using Shared.Models;
using Shared.Controllers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ItemService.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class BatchesController : BaseController
{
    private readonly IBatchAppService _batchAppService;

    public BatchesController(IBatchAppService batchAppService)
    {
        _batchAppService = batchAppService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedList<Batch>>), 200)]
    public async Task<IActionResult> GetBatches([FromQuery] BatchQuery query)
    {
        var result = await _batchAppService.GetBatchesAsync(query);
        return Success(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Batch>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CreateBatch([FromBody] CreateBatchRequest request)
    {
        var result = await _batchAppService.CreateBatchAsync(request.ClientId, request.UploadedBy, request.Description, request.Items);
        return Created(result);
    }

    [HttpPost("upload")]
    [ProducesResponseType(typeof(ApiResponse<Batch>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> UploadBatch([FromForm] UploadBatchRequest request)
    {
        var result = await _batchAppService.UploadBatchFromFileAsync(request);
        return Created(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<Batch>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetBatch(string id)
    {
        var result = await _batchAppService.GetBatchByIdAsync(id);
        return result != null ? Success(result) : NotFound("Batch not found");
    }

    [HttpGet("{id}/items")]
    [ProducesResponseType(typeof(ApiResponse<PagedList<Item>>), 200)]
    public async Task<IActionResult> GetBatchItems(string id, [FromQuery] ItemQuery query)
    {
        query.BatchId = id;
        var result = await _batchAppService.GetBatchItemsAsync(query);
        return Success(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateBatchStatus(string id, [FromBody] UpdateStatusRequest request)
    {
        var result = await _batchAppService.UpdateBatchStatusAsync(id, request.Status);
        return result != null ? Success(result) : NotFound("Batch not found");
    }
}