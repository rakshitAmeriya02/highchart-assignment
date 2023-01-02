import { getFormattedDate } from "./date";

interface Channel {
  label: string;
  value: string;
  type: number;
  guild: string;
  guildId: string;
  parentId: string | null;
  permissionOverwrites: string[];
  id: string;
  name: string;
  rawPosition: number;
  createdTimestamp: number;
}

interface MessageCount {
  count: string;
  timeBucket: string;
  channelId: string;
}

const defaultChartOptions = {
  chart: {
    backgroundColor: "#282c34",
    type: "spline",
  },
  accessibility: {
    enabled: false,
  },
  title: {
    text: "Message Count by date",
    style: {
      color: "rgb(204, 204, 204)",
    },
  },
  yAxis: {
    reversed: false,
    title: {
      enabled: true,
      text: "Message Count",
      style: {
        color: "rgb(204, 204, 204)",
      },
    },

    maxPadding: 0.05,
    showLastLabel: true,
    gridLineWidth: 0,
  },
  xAxis: {
    reversed: false,
    title: {
      enabled: true,
      text: "",
      style: {
        color: "rgb(204, 204, 204)",
      },
    },
    type: "datetime",
    maxPadding: 0.05,
    showLastLabel: true,
  },
  legend: {
    itemHoverStyle: {
      color: "#FFFFFF",
    },
    itemStyle: {
      color: "rgb(204, 204, 204)",
    },
    itemHiddenStyle: {
      color: "#dfedf533",
    },
  },
  series: [],
};

const getFormattedData = (
  messageCountList: MessageCount[],
  channels: Channel[]
) => {
  const data: {
    [key: number]: {
      count: number;
      label: string | undefined;
    };
  } = {};
  messageCountList.forEach((item) => {
    const { channelId, count, timeBucket } = item;
    const datetime = new Date(timeBucket).valueOf();
    const channel = channels.find((channel) => channel.id === channelId);
    if (data[datetime]) {
      data[datetime].count += +count;
    } else {
      data[datetime] = {
        count: +count,
        label: channel?.label || "N/A",
      };
    }
  });
  return [
    {
      name: "Channel",
      marker: {
        enabled: false,
      },
      data: Object.entries(data).map(([datetime, item]) => ({
        x: +datetime,
        y: item.count,
        name: item.label,
      })),
    },
  ];
};

export const engagementMessageOverTimeChartOptions = (
  messageCountList: MessageCount[],
  channels: Channel[]
) => {
  const options = JSON.parse(JSON.stringify(defaultChartOptions));
  options.series = getFormattedData(messageCountList, channels);
  options.tooltip = {
    shared: true,
    formatter: tooltipFormatter,
    crosshairs: {
      color: "#dfedf533",
      dashStyle: "solid",
      width: 3,
    },
    backgroundColor: "#17181bb3",
  };
  return options;
};

/**
 * @description custom tooltip formatter.
 */

const tooltipElement = (points: any, x: any) => {
  return `<div class="tooltip" style='background-color: #fff;color:rgb(204, 204, 204); box-shadow:
  0px 4px 4px rgba(0, 0, 0, 0.04), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px -2px 1px rgba(0, 0, 0, 0.04); padding: 7.5px 8px 6.5px 12px;'>${points.reduce(
    function (s: any, point: any) {
      return (
        s +
        "<br/>" +
        "<b>" +
        point.y +
        " messages on" +
        "</b> " +
        getFormattedDate(x[0]?.x)
      );
    },
    "<b>" + x[0]?.key + "</b>"
  )}</div>`;
};

export function tooltipFormatter(this: any) {
  let points = [this.point];
  if (this.points) points = this.points;
  return tooltipElement(points, points);
}
