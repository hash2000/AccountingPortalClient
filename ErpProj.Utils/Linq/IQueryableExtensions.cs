using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using ErpProj.Utils.ExtJs;

namespace ErpProj.Utils.Linq
{

    public static class IQueryableExtensions
    {
        public static IQueryable<T> Where<T>(this IQueryable<T> query, IEnumerable<ExtJsFilterInfo> filters)
        {
            if (filters == null)
                return query;

            foreach (var filter in filters)
            {
                if (!string.IsNullOrEmpty(filter.property) && !string.IsNullOrEmpty(filter.value))
                {
                    /*
                     * T = 
                     * {
                     *      Question = 
                     *      {
                     *          Name = "Test"
                     *      }
                     * };
                     * 
                     * filter.property = "Question.Name";
                     */

                    string[] properties = filter.property.Split('.');
                    PropertyInfo property = typeof(T).GetProperty(properties[0]);
                    for (int i = 1; i < properties.Length; i++)
                    {
                        string p = properties[i];
                        property = property.PropertyType.GetProperty(p);
                    }

                    string propertyType = property.PropertyType.ToString();

                    string expression;
                    switch (propertyType)
                    {
                        case "System.Int32":
                        case "System.Nullable`1[System.Int32]":
                        case "System.Byte":
                        case "System.Nullable`1[System.Byte]":
                            expression = string.Format("{0} {1} @0", filter.property, filter.@operator ?? "==");
                            int intValue = int.Parse(filter.value);
                            query = query.Where(expression, intValue);
                            break;
                        case "System.Int64":
                        case "System.Nullable`1[System.Int64]":
                            expression = string.Format("{0} {1} @0", filter.property, filter.@operator ?? "==");
                            long longValue = long.Parse(filter.value);
                            query = query.Where(expression, longValue);
                            break;
                        case "System.String":
                            //expression = string.Format("{0}.ToUpper().Contains(@0)", filter.property);
                            expression = string.Format("{0}.ToUpper() {1} (@0)", filter.property, filter.@operator ?? ".Contains");
                            query = query.Where(expression, filter.value.ToUpper());
                            break;
                        case "System.DateTime":
                        case "System.Nullable`1[System.DateTime]":
                            expression = string.Format("{0} {1} @0", filter.property, filter.@operator ?? "==");
                            DateTime dateValue = DateTime.Parse(filter.value);
                            query = query.Where(expression, dateValue);
                            break;
                        case "System.Boolean":
                        case "System.Nullable`1[System.Boolean]":
                            expression = string.Format("{0} {1} @0", filter.property, filter.@operator ?? "==");
                            bool boolValue = bool.Parse(filter.value);
                            query = query.Where(expression, boolValue);
                            break;
                        case "System.Int16":
                        case "System.Nullable`1[System.Int16]":
                            expression = string.Format("{0} {1} @0", filter.property, filter.@operator ?? "==");
                            short shortValue = short.Parse(filter.value);
                            query = query.Where(expression, shortValue);
                            break;
                        case "System.Guid":
                        case "System.Nullable`1[System.Guid]":
                            expression = string.Format("{0} == @0", filter.property);
                            //expression = string.Format("{0} {1} @0", filter.property, filter.@operator ?? "==");
                            Guid guidValue = Guid.Parse(filter.value);
                            query = query.Where(expression, guidValue);
                            break;

                        default:
                            expression = string.Format("{0} == @0", filter.property);
                            query = query.Where(expression, filter.value);
                            break;
                    }
                }
            }
            return query;
        }

        /// <summary>
        /// Фильтрация запроса вместе с сортировкой и разбивкой на страницы
        /// </summary>
        /// <param name="query"></param>
        /// <param name="sorters"></param>
        /// <param name="filters"></param>
        /// <param name="start"></param>
        /// <param name="limit"></param>
        /// <returns></returns>
        public static IEnumerable<T> Where<T>(this IQueryable<T> query,
            IEnumerable<ExtJsSortInfo> sorters,
            IEnumerable<ExtJsFilterInfo> filters,
            int start,
            int limit)
        {
            return query.Where(filters)
                .OrderBy(sorters)
                .Skip(start)
                .Take(limit)
                .ToList();
        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="sorters"></param>
        /// <param name="filters"></param>
        /// <returns></returns>
        public static IEnumerable<T> Where<T>(this IQueryable<T> query,
            IEnumerable<ExtJsSortInfo> sorters,
            IEnumerable<ExtJsFilterInfo> filters)
        {
            return query.Where(filters)
                .OrderBy(sorters)
                .ToList();
        }


        public static IQueryable<T> OrderBy<T>(this IQueryable<T> query, IEnumerable<ExtJsSortInfo> sorters)
        {
            if (sorters == null)
                return query;

            string ordering = string.Join<ExtJsSortInfo>(", ", sorters);
            query = query.OrderBy(ordering);
            return query;
        }

        //TODO: обработка динамической группировки

        //public static IQueryable<T> GroupBy<T>(this IQueryable<T> query, IEnumerable<ExtJsGroupInfo> group)
        //{
        //    if (group == null)
        //        return query;
        //    var e = GetColumnName<T>(group.First().property);
        //    var s = query.GroupBy(e.Compile());
        //    return query;
        //}

        //public static Expression<Func<TElement, string>> GetColumnName<TElement>(string property)
        //{
        //    var menu = Expression.Parameter(typeof(TElement), "groupCol");
        //    var property = Expression.PropertyOrField(menu, property);
        //    var lambda = Expression.Lambda<Func<TElement, string>>(property, menu);
        //    return lambda;
        //}
    }

}