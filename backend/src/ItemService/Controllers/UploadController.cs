using Microsoft.AspNetCore.Mvc;
using ItemService.Application.Interfaces;
using ItemService.DTOs;
using Shared.Models;
using Shared.Controllers;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ItemService.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UploadController : BaseController
{
    private readonly IBatchAppService _batchAppService;

    public UploadController(IBatchAppService batchAppService)
    {
        _batchAppService = batchAppService;
    }

    [HttpPost("batch")]
    [ProducesResponseType(typeof(ApiResponse<Batch>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> UploadBatch([FromForm] BatchUploadRequest request)
    {
        var result = await _batchAppService.ProcessBatchUploadAsync(request);
        return Ok(result);
    }
}