using System;

namespace ErpProj.Utils.ExtJs
{
    /// <summary>
    /// Ответ для ExtJs
    /// </summary>
    /// <remarks>
    /// В ExtJs reader должен обязательно быть сконфигурирован с параметром 'root': 'items'.
    /// или root : children для деревьев
    /// </remarks>
    [Serializable]
    public class ExtJsSortInfo
    {
        public string property { get; set; }
        public string direction { get; set; }

        public override string ToString()
        {
            return $"{property} {direction}";
        }
    }

}