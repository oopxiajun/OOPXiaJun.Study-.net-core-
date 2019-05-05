FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 7205
EXPOSE 44338

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY OOPXiaJun.Study.MyRazorWeb/OOPXiaJun.Study.MyRazorWeb.csproj OOPXiaJun.Study.MyRazorWeb/
RUN dotnet restore OOPXiaJun.Study.MyRazorWeb/OOPXiaJun.Study.MyRazorWeb.csproj
COPY . .
WORKDIR /src/OOPXiaJun.Study.MyRazorWeb
RUN dotnet build OOPXiaJun.Study.MyRazorWeb.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish OOPXiaJun.Study.MyRazorWeb.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "OOPXiaJun.Study.MyRazorWeb.dll"]
