#FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
#WORKDIR /app
#EXPOSE 80
#FROM microsoft/dotnet:2.1-sdk AS build
#WORKDIR /src
#COPY OOPXiaJun.Study.Docker_1.csproj OOPXiaJun.Study.Docker_1/
#RUN dotnet restore OOPXiaJun.Study.Docker_1/OOPXiaJun.Study.Docker_1.csproj
#COPY . .
#WORKDIR /src/OOPXiaJun.Study.Docker_1
#RUN dotnet build  -c Release -o /app
#FROM build AS publish
#RUN dotnet publish -c Release -o /app
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app .
#ENTRYPOINT ["dotnet", "OOPXiaJun.Study.Docker_1.dll"]


#选择从什么镜像基础上创建我们的镜像，相当于选择我们依赖的环境 
FROM microsoft/aspnetcore:latest 
#把当前目录复制到镜像的 app目录 
COPY . /app 
#指定工作目录 
WORKDIR /app 
#暴露的端口 是之前准备asp.net core应用设置的端口一致 UseUrls(“http://*:12345”) 
EXPOSE 80 
#最后设置启动的dll 
ENTRYPOINT ["dotnet","OOPXiaJun.Study.Docker_1.dll"]
