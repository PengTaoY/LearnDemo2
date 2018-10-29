using Microsoft.AspNetCore.SignalR;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace StreamingInSignalR.Hubs
{
    public class StreamHub : Hub
    {
        public ChannelReader<int> DelayCounter(int delay)
        {
            var channel = Channel.CreateUnbounded<int>();

            _ = WriteItems(channel.Writer, 20, delay);

            return channel.Reader;
        }

        //DelayCounter是一个流式传输方法, 它定义了一个延迟参数delay, 定义了推送数据碎片的间隔时间
        //WriteItems是一个私有方法，它返回了一个Task对象
        //WriteItems方法的最后一行writer.TryComplete()表明了流式传输完成

        private async Task WriteItems(ChannelWriter<int> writer, int count, int delay)
        {
            for (int i = 0; i < count; i++)
            {
                await writer.WriteAsync(i);
                await Task.Delay(delay);
            }
            writer.TryComplete();
        }
    }
}
