using AutoMapper;
using AutoMapperDemo.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AutoMapperDemo.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefaultController : ControllerBase
    {
        private readonly IMapper _mapper;

        public DefaultController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<B> Test()
        {
            A a = new A() { name = "张三", CreateTime = DateTime.Now, id = 1, justa = "只有A才有的值" };
            List<A> lista = new List<A>
            {
                a
            };

            //  _mapper.pr

            B b = _mapper.Map<B>(a);

            var s = _mapper.Map<IEnumerable<A>, IEnumerable<B>>(lista);


            A aa = _mapper.Map<A>(b);
            var sa = _mapper.Map<IEnumerable<B>, IEnumerable<A>>(s);

            return s;
        }
    }
}