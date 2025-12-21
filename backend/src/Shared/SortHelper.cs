using System;
using System.Linq;
using System.Linq.Expressions;

namespace Shared.Models;

public static class SortHelper<T>
{
    public static IQueryable<T> OrderByDynamic(IQueryable<T> source, string orderByProperty)
    {
        if (string.IsNullOrEmpty(orderByProperty))
            return source;

        var type = typeof(T);
        var parameter = Expression.Parameter(type, "p");
        
        var parts = orderByProperty.Split(' ');
        var propertyName = parts[0];
        var isDescending = parts.Length > 1 && parts[1].ToLower() == "desc";

        var property = type.GetProperty(propertyName);
        if (property == null)
            return source;

        var propertyAccess = Expression.MakeMemberAccess(parameter, property);
        var orderByExpression = Expression.Lambda(propertyAccess, parameter);

        var methodName = isDescending ? "OrderByDescending" : "OrderBy";
        var resultExpression = Expression.Call(
            typeof(Queryable),
            methodName,
            new Type[] { type, property.PropertyType },
            source.Expression,
            Expression.Quote(orderByExpression));

        return source.Provider.CreateQuery<T>(resultExpression);
    }
}