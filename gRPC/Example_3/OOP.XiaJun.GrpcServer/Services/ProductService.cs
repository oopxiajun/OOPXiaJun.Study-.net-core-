using Grpc.Core;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOP.XiaJun.GrpcServer.Services
{
    public class ProductService:ProductServer.ProductServerBase
    {
        private readonly ILogger<GreeterService> _logger;
        public ProductService(ILogger<GreeterService> logger)
        {
            _logger = logger;
        } 
        public override Task<ProductModel> GetProductByPid(ProductPid request, ServerCallContext context)
        {
            return Task.FromResult(new ProductModel
            {
                Pid="Pid:"+ request.Pid,
                Name= "Name:" + Guid.NewGuid().ToString(),
                Price = Math.Round(100d),
            });
        }
    }
}
