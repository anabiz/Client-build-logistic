using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shared.Models;

public class PagedList<T>
{
    public int CurrentPage { get; private set; }
    public int PageSize { get; private set; }
    public int TotalRecords { get; set; }
    public int TotalPages { get; private set; }
    public List<T> Result { get; set; } = new List<T>();

    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        TotalRecords = count;
        PageSize = pageSize;
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        Result = items;
    }

    public static async Task<PagedList<T>> Create(IQueryable<T> source, int pageNumber, int pageSize, string sort = null)
    {
        var count = await source.CountAsync();
        if (pageSize == 0)
        {
            pageSize = count;
        }

        if (!string.IsNullOrEmpty(sort))
        {
            var sortedData = SortHelper<T>.OrderByDynamic(source, sort);

            var items = await sortedData.Skip(((pageNumber - 1) * pageSize)).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
        else
        {
            var items = await source.Skip(((pageNumber - 1) * pageSize)).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}