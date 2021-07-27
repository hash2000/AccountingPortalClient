using System;
using System.Linq;

namespace ErpProj.Utils.ExtJs
{
    [Serializable]
    public class ExtJsFilterInfo
    {
        public string property { get; set; }

        public string field
        {
            get
            {
                return property;
            }
            set
            {
                property = value;
            }
        }

        public string value { get; set; }

        public string @operator { get; set; }
    }

    /// <summary>
    /// Из Docs - класс расширение для поиска по имени фильтра 
    /// </summary>
    public static class ExJsFilterInfo
    {
        /// <summary>
        /// Найти значение фильтра по имени
        /// </summary>
        public static T? Find<T>(this ExtJsFilterInfo[] filters, string property)
            where T : struct
        {
            if (filters == null)
            {
                return null;
            }

            var returnType = typeof(T);
            var typeCode = Type.GetTypeCode(returnType);
            Func<string, object> convert;

            switch (typeCode)
            {
                //case TypeCode.String:
                //    convert = (s) => s;
                //    break;
                case TypeCode.Int32:
                    convert = (s) => Convert.ToInt32(s);
                    break;
                case TypeCode.Boolean:
                    convert = (s) => Convert.ToBoolean(s);
                    break;
                case TypeCode.DateTime:
                    convert = (s) => Convert.ToDateTime(s);
                    break;
                default:
                    throw new NotSupportedException(typeof(T).Name);
            }

            var filtersSlice = filters
                .Where(f => f.property == property);
            var filter = filtersSlice.FirstOrDefault();

            if (filter == null || filter.value == null)
            {
                return new T?();
            }

            var result = filtersSlice
                .Select(f => convert(f.value))
                .OfType<T>()
                .FirstOrDefault();

            return new T?(result);
        }

        /// <summary>
        /// Найти значение строкового фильтра (возможен null)
        /// </summary>
        /// <param name="filters"></param>
        /// <param name="property"></param>
        /// <returns></returns>
        public static string FindString(this ExtJsFilterInfo[] filters, string property)
        {
            if (filters == null)
            {
                return null;
            }
            var filter = filters
                .Where(f => f.property == property)
                .SingleOrDefault();

            //или null или value
            return filter?.value;
        }

        public static Guid? FindGuid(this ExtJsFilterInfo[] filters, string property)
        {
            if (filters == null)
            {
                return null;
            }
            var filter = filters
                .Where(f => f.property == property)
                .SingleOrDefault();

            if (filter == null || filter.value == null)
            {
                return null;
            }

            //или null или value
            return Guid.Parse(filter?.value);
        }

        /// <summary>
        /// Исключить фильтр из набора
        /// </summary>
        public static ExtJsFilterInfo[] Exclude(this ExtJsFilterInfo[] filters, string property)
        {
            return filters?.Where(f => f.property != property).ToArray();
        }

        /// <summary>
        /// Исключить фильтры из набора помеченные "remove..."
        /// </summary>
        public static ExtJsFilterInfo[] ExcludeRemove(this ExtJsFilterInfo[] filters)
        {
            return filters?.Where(f => !f.property.StartsWith("remove.")).ToArray();
        }
    }

}