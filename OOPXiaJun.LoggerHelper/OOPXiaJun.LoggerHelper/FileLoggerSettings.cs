using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.LoggerHelper
{
    public class FileLoggerSettings
    {
        IConfiguration configuration;
        public FileLoggerSettings(IConfiguration configuration) {
            this.configuration = configuration;
        }


        public string DefaultPath { get; set; }

        public float? DefaultMaxMB { get; set; }

        public string DefaultFileName { get; set; }

        public string DefaultRollingType { get; set; }

        public LogLevel LogLevel { get; set; }
    }
}
