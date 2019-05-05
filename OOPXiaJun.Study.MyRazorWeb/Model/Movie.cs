using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.MyRazorWeb.Model
{
    [Serializable]
    public class Movie
    {
        /// <summary>
        /// id
        /// </summary>
        public int ID { get; set; }
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 发布时间
        /// [DataType(DataType.Date)]：DataType 属性指定数据的类型（日期）。 通过此特性：
        ///       用户无需在数据字段中输入时间信息。
        ///仅显示日期，而非时间信息。
        /// </summary>
        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public string Genre { get; set; }
        /// <summary>
        /// 价格
        /// </summary>
        public decimal Price { get; set; }
    }
}
