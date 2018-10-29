using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace WebApplication2.Middleware
{
    public class NumberMiddleware
    {
        private readonly RequestDelegate _next;

        public NumberMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var value = context.Request.Query["value"].ToString();
            if (int.TryParse(value, out int number))
            {
                await context.Response.WriteAsync($" The Number is {number}");
            }
            else
            {
                context.Items["value"] = value;
                await _next(context);
            }
        }
    }
}
