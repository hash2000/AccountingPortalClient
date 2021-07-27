using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using ErpProj.Utils.Linq;

namespace ErpProj.Utils.ExtJs
{
    public static class ExtJsResultExtensions
    {

        /// <summary>
        /// 
        /// Формирование дерева items -> children
        /// </summary>
        /// <param name="tResult"></param>
        /// <returns></returns>
        // [System.Obsolete("рекомендуется использовать новый метод ToExtJsTree", false)]
        public static ExtJsResult ToTree(this ExtJsResult tResult)
        {
            tResult.children = tResult.items;
            tResult.items = null;
            return tResult;
        }

        /// <summary>
        /// Сформировать ExtJsResult применив фильтр и сортировку к запросу
        /// </summary>
        public static ExtJsResult ToExtJs<T>(this IQueryable<T> query, ExtJsSortInfo[] sort, ExtJsFilterInfo[] filter, int? start = null, int? limit = null)
        {
            //удалить!!! фильтры "remove..."
            filter = filter.ExcludeRemove();

            if (query == null)
            {
                throw new ArgumentNullException("query");
            }

            //Количество отфильтрованных записей (всего по фильтру)
            var count = query.Where(filter).Count();

            query = filter == null ? query : query.Where(filter);
            query = sort == null ? query : query.OrderBy(sort);

            var result = start.HasValue && limit.HasValue ?
                query.Skip(start.Value).Take(limit.Value) :
                query;

            return new ExtJsResult()
            {
                total = query == null ? 0 : count,
                items = query == null ? new List<T>() : result.ToList(),
                success = true
            };
        }

        /// <summary>
        /// Сформировать ExtJsResult 
        /// с указанием полного количества записей(необходимо при paging)
        /// </summary>
        public static ExtJsResult ToExtJs<T>(this IEnumerable<T> items, int count)
        {
            return new ExtJsResult()
            {
                total = count,
                items = items == null ? new List<T>() : items.ToList(),
                success = true
            };
        }

        /// <summary>
        /// Сформировать ExtJsResult из IEnumerable<T>
        /// </summary>
        public static ExtJsResult ToExtJs<T>(this IEnumerable<T> items)
        {
            var result = items == null ? new List<T>() : items.ToList();
            return new ExtJsResult()
            {
                total = result.Count(),
                items = result,
                success = true
            };
        }

        /// <summary>
        /// Сформировать ExtJsResult из IQueryable<T> 
        /// </summary>
        public static ExtJsResult ToExtJs<T>(this IQueryable<T> items)
        {
            return ToExtJs<T>(items: items.AsEnumerable());
        }

        /// <summary>
        /// Сформировать ExtJsResult из IOrderedQueryable<T>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <returns></returns>
        public static ExtJsResult ToExtJs<T>(this IOrderedQueryable<T> items)
        {
            return ToExtJs<T>(items: items.AsEnumerable());
        }

        /// <summary>
        /// Сформировать ExtJsResult из одиночного объекта
        /// </summary>
        public static ExtJsResult ToExtJs<T>(this T item)
        {
            return new ExtJsResult()
            {
                items = new[] { item },
                total = 1,
                success = true
            };
        }
    }
}
