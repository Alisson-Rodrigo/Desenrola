using Desenrola.Domain.Exception;
using System.Net;

namespace Desenrola.WebApi.Middleware
{
    public class CustomExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ApiException ex)
            {
                context.Response.StatusCode = (int)ex.StatusCode;
                context.Response.ContentType = "application/json";

                var result = new
                {
                    message = ex.Message
                };

                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(result));
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                Console.WriteLine(ex);


                var result = new
                {
                    message = "Ocorreu um erro inesperado."
                };

                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(result));
            }
        }
    }
}
