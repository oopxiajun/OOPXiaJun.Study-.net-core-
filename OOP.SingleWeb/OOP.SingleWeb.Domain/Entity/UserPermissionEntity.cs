using System;

namespace OOP.SingleWeb.Domain.Entities
{
	/// <summary>
	/// 用户权限实体模型
	/// </summary>
	/// <remarks>create by ****** 2018-07-14 10:39:35</remarks>
	[Serializable]
	public partial class UserPermissionEntity : BaseDomain
	{

		/// <summary>
		/// 主键
		/// </summary>
		public string Pid{ get ; set; }

		/// <summary>
		/// 系统用户主键
		/// </summary>
		public string UserPid{ get ; set; }

		/// <summary>
		/// 系统功能权限主键
		/// </summary>
		public string PermissionPid{ get ; set; }
	}
}

