

using System;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace ErpProj.Utils.Helpers
{
    public static class MenuItemHelper
    {
        /// <summary>
        /// Получение Id текущего MenuItem
        /// </summary>
        /// <returns></returns>
        public static int? GetMenuItemId(this HttpContext requestContext)
        {
            // Берём из Route или из Referrer
            int menuItemId;
            string menuItemIdValue = requestContext.Request.RouteValues
              .Select(kvp => kvp.Value.ToString()).Last();

            if (int.TryParse(menuItemIdValue, out menuItemId))
            {
                return menuItemId;
            }
            else
            {
                var request = requestContext.Request;
                var requestHeaders = request.GetTypedHeaders();

                menuItemIdValue = requestHeaders.Referer?.LocalPath
                  .Split('/')
                  .Last();

                if (int.TryParse(menuItemIdValue, out menuItemId))
                {
                    return menuItemId;
                }
                // else
                // {
                //   if (!string.IsNullOrEmpty(request.Scheme))
                //   {
                //     var uri = new Uri(request.Scheme);
                //     // Если из .UrlReferrer не вытянули menuItemIdValue, ищем в .Url
                //     // Добавлен для работы модуля "RedirectTo"
                //     menuItemIdValue = uri.LocalPath.Split('/').Last();
                //     if (int.TryParse(menuItemIdValue, out menuItemId))
                //     {
                //       return menuItemId;
                //     }
                //   }
                // }
            }

            return null;
        }
    }

}