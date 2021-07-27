using System;
using System.Collections;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ErpProj.Utils.ExtJs
{
    /// <summary>
    /// Ответ для ExtJs
    /// </summary>
    /// <remarks>
    /// В ExtJs reader должен обязательно быть сконфигурирован с параметром 'root': 'items'.
    /// или root : children для деревьев
    /// </remarks>
    [JsonObject(MemberSerialization.OptIn)]
    public class ExtJsResult : ActionResult
    {
        [JsonProperty]
        public IEnumerable items { get; set; }

        [JsonProperty]
        public IEnumerable children { get; set; }

        [JsonProperty]
        public int total { get; set; }

        [JsonProperty]
        public bool success { get; set; }

        [JsonProperty]
        public string message { get; set; }

        [JsonProperty]
        public string messageText { get; set; }

        [JsonProperty]
        public string assemblyVersion
        {
            get
            {
                var assembly = System.Reflection.Assembly.GetExecutingAssembly();
                return assembly.GetName().Version.ToString();
            }
        }

        public override void ExecuteResult(ActionContext context)
        {
            var json = SerializeResult();
            var jsonStream = Encoding.UTF8.GetBytes(json);

            context.HttpContext.Response.BodyWriter.WriteAsync(jsonStream);
        }

        public string SerializeResult()
        {
            var settings = GetJsonSettings();
            return JsonConvert.SerializeObject(this, Formatting.Indented, settings);
        }

        private JsonSerializerSettings GetJsonSettings()
        {
            var settings = new JsonSerializerSettings();
            settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            settings.Converters.Add(new IsoDateTimeConverter());

            //if (Plain)
            //{
            //    settings.ContractResolver = new NoNavigationContractResolver();
            //}

            return settings;
        }
    }

}