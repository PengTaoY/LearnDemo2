using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace WebApplication2
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddRouting();
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            #region 中间件
            //app.Map("/return", (skipApp) => skipApp.Run(async (context) => await context.Response.WriteAsync("Returned!")));

            //app.Use(async (context, next) =>
            //{
            //    if (context.Request.Path == "/end")
            //    {
            //        await context.Response.WriteAsync("The End");
            //    }
            //    else
            //    {
            //        await next();
            //    }
            //});

            ////app.Use(async (context, next) =>
            ////{
            ////    var value = context.Request.Query["value"].ToString();
            ////    if (int.TryParse(value, out int number))
            ////    {
            ////        await context.Response.WriteAsync($"The number is {number}");
            ////    }
            ////    else
            ////    {
            ////        context.Items["value"] = value;
            ////        await next();
            ////    }
            ////});

            //app.UseMiddleware<NumberMiddleware>();
            #endregion

            #region 路由中间件
            //app.UseRouter(builder =>
            //{
            //    builder.MapRoute(string.Empty, context => context.Response.WriteAsync("Default value."));
            //    builder.MapGet("user/{name}", (req, res, routeData) => res.WriteAsync($"Hi {routeData.Values["name"]}"));
            //    builder.MapPost("user/{name}", (req, res, routeData) => res.WriteAsync($"Hi, posted name is {routeData.Values["names"]}"));
            //});

            #endregion

            #region MVC路由
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Default}/{action=Index}/{id?}"
                    );
            });

            #endregion



            //app.Run(async (context) =>
            //{
            //    var value = context.Items["value"].ToString();
            //    await context.Response.WriteAsync($"Hello,the value is {value}!");
            //});
        }
    }
}
