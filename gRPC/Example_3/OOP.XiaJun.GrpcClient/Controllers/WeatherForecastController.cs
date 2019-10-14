using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Net.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace OOP.XiaJun.GrpcClient.Controllers
{
    [ApiController]
    [Route("{controller}/{action}")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
        [HttpGet]
        public OOP.XiaJun.GrpcServer.ProductModel GetProduct(string pid)
        {
            var channel = GrpcChannel.ForAddress("https://localhost:5001");
            var client = new OOP.XiaJun.GrpcServer.ProductServer.ProductServerClient(channel);//  Greeter.GreeterClient(channel);
            var reply = client.GetProductByPid(
                              new GrpcServer.ProductPid { Pid = pid });
            return reply;
        }
    }
}
