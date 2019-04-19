using AutoMapper;
using System;

namespace AutoMapperDemo.Utils
{
    public class AutoMapperConfigs : Profile
    {
        //添加你的实体映射关系.
        public AutoMapperConfigs()
        {
            //GoodsEntity转GoodsDto.
            CreateMap<A, B>()
                //映射发生之前
                .BeforeMap((source, dto) =>
                {
                    //可以较为精确的控制输出数据格式
                    dto.CreateTime = Convert.ToDateTime(source.CreateTime).ToString("yyyy-MM-dd");
                })
                //映射发生之后
                .AfterMap((source, dto) =>
                {
                    //code ...
                })
                .ForMember(back=>back.justb,n=>n.Ignore());

            //GoodsDto转GoodsEntity.
            CreateMap<B, A>();

        //    Mapper.AssertConfigurationIsValid();

        }
    }


    public class A
    {
        public int id { get; set; }
        public string name { get; set; }

        public DateTime CreateTime { get; set; }

        public string justa { get; set; }
    }

    public class B
    {
        public int id { get; set; }

        public string name { get; set; }

        public string CreateTime { get; set; }

        public string justb { get; set; }
    }
}
