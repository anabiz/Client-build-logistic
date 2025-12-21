FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/ItemService/ItemService.csproj", "src/ItemService/"]
COPY ["src/Shared/Shared.csproj", "src/Shared/"]
RUN dotnet restore "src/ItemService/ItemService.csproj"
COPY . .
WORKDIR "/src/src/ItemService"
RUN dotnet build "ItemService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ItemService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ItemService.dll"]