using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ErpProj.Utils.Helpers
{
    public static class ValueCopyHelper
    {
        /// <summary>
        /// Проверить, Nullable поле или нет
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        private static bool IsNullableType(Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>));
        }

        private static IEnumerable<System.Reflection.PropertyInfo> CheckProperties(this IEnumerable<System.Reflection.PropertyInfo> items)
        {
            return items.Where(n => !n.GetMethod.IsVirtual || n.GetMethod.IsFinal);
        }


        /// <summary>
        /// Скопировать значения полей из itemFrom в itemTo, имена которых совпадают
        /// </summary>
        /// <typeparam name="TFrom"></typeparam>
        /// <typeparam name="TTo"></typeparam>
        /// <param name="itemFrom"></param>
        /// <param name="itemTo"></param>
        public static void CopyTypePropertyValues<TFrom, TTo>(TFrom itemFrom, TTo itemTo)
           where TFrom : class
           where TTo : class
        {
            var itemToModelType = itemTo.GetType();
            var itemFromModelType = itemFrom.GetType();
            var itemToProperties = itemToModelType.GetProperties()
                .CheckProperties();
            var itemFromProperties = itemFromModelType.GetProperties()
                .CheckProperties();

            foreach (var i in itemFromProperties)
            {
                var toProperty = itemToProperties
                    .SingleOrDefault(n => n.Name.ToLowerInvariant() == i.Name.ToLowerInvariant());
                if (toProperty == null)
                    continue;
                var targetType = IsNullableType(i.PropertyType) ?
                    Nullable.GetUnderlyingType(i.PropertyType) : i.PropertyType;
                var value = i.GetValue(itemFrom);

                if (value != null)
                {
                    var typedValue = Convert.ChangeType(value, targetType);
                    toProperty.SetValue(itemTo, typedValue);
                }
                else
                {
                    toProperty.SetValue(itemTo, null);
                }
            }
        }
    }

}