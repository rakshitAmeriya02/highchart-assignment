import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { engagementHelper } from "helpers";
import channels from "modules/channels.json";
import messageCountList from "modules/messageCountList.json";

const EngagementMessagesOverTime = () => {
  const options = engagementHelper.engagementMessageOverTimeChartOptions(
    messageCountList,
    channels
  );

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{
        style: { width: "90%", height: "80%" },
      }}
    />
  );
};

export default EngagementMessagesOverTime;
