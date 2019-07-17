using System;

namespace OOP.SingleWeb.Domain.Entities
{
	/// <summary>
	/// 用户(管理端用户)实体模型
	/// </summary>
	/// <remarks>create by ****** 2018-07-14 10:39:35</remarks>
	[Serializable]
	public partial class UserEntity : BaseDomain
	{
		/// <summary>
		/// 主键(GUID)
		/// </summary>
		public string Pid{ get ; set; }

		/// <summary>
		/// 登录名
		/// </summary>
		public string UserName{ get ; set; }

		/// <summary>
		/// 密码
		/// </summary>
		public string Password{ get ; set; }

		/// <summary>
		/// 姓名
		/// </summary>
		public string Name{ get ; set; }

		/// <summary>
		/// 性别(0:男,1:女)
		/// </summary>
		public int Sex{ get ; set; }

		/// <summary>
		/// 电话号码
		/// </summary>
		public string Tel{ get ; set; }

		/// <summary>
		/// 电子邮件
		/// </summary>
		public string Email{ get ; set; }

		/// <summary>
		/// 头像
		/// </summary>
		public string Photo{ get ; set; }

		/// <summary>
		/// 登录后是否需要修改密码(0:需要 1:不需要)
		/// </summary>
		public int ChangePasswordOnLogin{ get ; set; }

		/// <summary>
		/// 可用标志(0:启用,1:禁用)
		/// </summary>
		public int ActiveFlag{ get ; set; }

		/// <summary>
		/// 备注
		/// </summary>
		public string Remark{ get ; set; }

		/// <summary>
		/// 创建人
		/// </summary>
		public string CreateUser{ get ; set; }

		/// <summary>
		/// 创建时间
		/// </summary>
		public DateTime CreateDate{ get ; set; }

		/// <summary>
		/// 更新人
		/// </summary>
		public string UpdateUser{ get ; set; }

		/// <summary>
		/// 更新时间
		/// </summary>
		public DateTime? UpdateDate{ get ; set; }
	}
}

