using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace OOP.SingleWeb.Web
{
    public class Startup
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfiguration _config;
        private readonly ILoggerFactory _loggerFactory;
        public Startup(IHostingEnvironment env, IConfiguration config,
        ILoggerFactory loggerFactory)
        {
            Configuration = config;
            _env = env;
            _config = config;
            _loggerFactory = loggerFactory;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //注册应用服务
            services.AddAppServices();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

         


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {





            var logger = _loggerFactory.CreateLogger<Startup>();

            if (_env.IsDevelopment())
            {
                // Development service configuration

                logger.LogInformation("Development environment");
            }
            else
            {
                // Non-development service configuration

                logger.LogInformation($"Environment: {_env.EnvironmentName}");
            }


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
