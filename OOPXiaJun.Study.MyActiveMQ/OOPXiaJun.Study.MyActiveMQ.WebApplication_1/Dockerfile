FROM microsoft/dotnet:2.1-aspnetcore-runtime-nanoserver-1709 AS base
WORKDIR /app
EXPOSE 63138
EXPOSE 44347

FROM microsoft/dotnet:2.1-sdk-nanoserver-1709 AS build
WORKDIR /src
COPY ../OOPXiaJun.Study.MyActiveMQ/OOPXiaJun.Study.MyActiveMQ.WebApplication_1/OOPXiaJun.Study.MyActiveMQ.WebApplication_1.csproj ../OOPXiaJun.Study.MyActiveMQ/OOPXiaJun.Study.MyActiveMQ.WebApplication_1/
RUN dotnet restore ../OOPXiaJun.Study.MyActiveMQ/OOPXiaJun.Study.MyActiveMQ.WebApplication_1/OOPXiaJun.Study.MyActiveMQ.WebApplication_1.csproj
COPY . .
WORKDIR /src/../OOPXiaJun.Study.MyActiveMQ/OOPXiaJun.Study.MyActiveMQ.WebApplication_1
RUN dotnet build OOPXiaJun.Study.MyActiveMQ.WebApplication_1.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish OOPXiaJun.Study.MyActiveMQ.WebApplication_1.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "OOPXiaJun.Study.MyActiveMQ.WebApplication_1.dll"]
