import { useLayoutEffect } from 'react';
// import './App.css';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";


export const DepthChart = () => {
  useLayoutEffect(() => {

    let root = am5.Root.new("chartdiv");

    root._logo.dispose();

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none"
      })
    );

    let title = chart.plotContainer.children.push(am5.Label.new(root, {
      text: "Price (BTC/ETH)",
      fontSize: 20,
      fontWeight: "400",
      x: am5.p50,
      centerX: am5.p50
    }))

    let xValueAxis = am5xy.AxisRendererX.new(root, {
      minGridDistance: 70
    });

    xValueAxis.labels.template.setAll({
      fill: am5.color(0xFFFFFF)
    })


    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "value",
      renderer: xValueAxis,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.get("renderer").labels.template.adapters.add("text", function (text, target) {
      if (target.dataItem) {
        return root.numberFormatter.format(Number(target.dataItem.get("visible")), "#.####");
      }
      return text;
    });

    let yValueAxis = am5xy.AxisRendererY.new(root, {})

    yValueAxis.labels.template.setAll({
      fill: am5.color(0xFFFFFF)
    })

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.1,
        renderer: yValueAxis
      })
    );

    let bidsTotalVolume = chart.series.push(am5xy.StepLineSeries.new(root, {
      minBulletDistance: 10,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "bidstotalvolume",
      categoryXField: "value",
      stroke: am5.color(0x00ff00),
      fill: am5.color(0x00ff00),
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "[width: 120px]Ask:[/][bold]{categoryX}[/]\n[width: 120px]Total volume:[/][bold]{valueY}[/]\n[width: 120px]Volume:[/][bold]{bidsvolume}[/]"
      })
    }));
    bidsTotalVolume.strokes.template.set("strokeWidth", 2)
    bidsTotalVolume.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    });

    let asksTotalVolume = chart.series.push(am5xy.StepLineSeries.new(root, {
      minBulletDistance: 10,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "askstotalvolume",
      categoryXField: "value",
      stroke: am5.color(0xf00f00),
      fill: am5.color(0xff0000),
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "[width: 120px]Ask:[/][bold]{categoryX}[/]\n[width: 120px]Total volume:[/][bold]{valueY}[/]\n[width: 120px]Volume:[/][bold]{asksvolume}[/]"
      })
    }));
    asksTotalVolume.strokes.template.set("strokeWidth", 2)
    asksTotalVolume.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    });

    let bidVolume = chart.series.push(am5xy.ColumnSeries.new(root, {
      minBulletDistance: 10,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "bidsvolume",
      categoryXField: "value",
      fill: am5.color(0x000000)
    }));
    bidVolume.columns.template.set("fillOpacity", 0.2);

    let asksVolume = chart.series.push(am5xy.ColumnSeries.new(root, {
      minBulletDistance: 10,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "asksvolume",
      categoryXField: "value",
      fill: am5.color(0x000000)
    }));
    asksVolume.columns.template.set("fillOpacity", 0.2);

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis
    }));
    cursor.lineY.set("visible", false);

    let data = {
      "asks": [["0.07070", 1.0], ["0.07071", 1.654], ["0.07076", 0.61], ["0.07077", 1.2], ["0.07093", 0.584], ["0.07095", 0.005], ["0.07098", 0.01], ["0.07100", 0.653], ["0.07105", 6.0], ["0.07107", 0.002], ["0.07110", 0.022], ["0.07113", 0.001], ["0.07115", 0.001], ["0.07117", 0.001], ["0.07119", 0.001], ["0.07123", 0.001], ["0.07124", 0.002], ["0.07125", 0.001], ["0.07127", 0.001], ["0.07129", 0.001], ["0.07130", 0.001], ["0.07131", 0.001], ["0.07133", 0.001], ["0.07135", 0.002], ["0.07137", 0.001], ["0.07139", 0.001], ["0.07141", 0.001], ["0.07143", 0.001], ["0.07145", 0.001], ["0.07147", 0.004], ["0.07148", 6.311], ["0.07149", 0.001], ["0.07150", 10.03], ["0.07151", 0.001], ["0.07153", 0.001], ["0.07155", 0.001], ["0.07157", 0.001], ["0.07159", 0.001], ["0.07161", 0.001], ["0.07162", 0.238], ["0.07163", 0.001], ["0.07164", 0.584], ["0.07165", 0.541], ["0.07167", 0.001], ["0.07169", 0.001], ["0.07171", 0.001], ["0.07173", 0.001], ["0.07175", 0.017], ["0.07177", 0.001], ["0.07179", 0.001]],
      "bids": [["0.07060", 1.001], ["0.07059", 1.544], ["0.07056", 0.61], ["0.07053", 0.002], ["0.07048", 1.2], ["0.07040", 0.05], ["0.07031", 0.663], ["0.07024", 0.005], ["0.07020", 5.99], ["0.07010", 0.022], ["0.07006", 0.001], ["0.07005", 0.003], ["0.07000", 1.0], ["0.06993", 0.002], ["0.06990", 6.15], ["0.06989", 0.519], ["0.06986", 0.001], ["0.06983", 0.024], ["0.06980", 0.031], ["0.06978", 0.01], ["0.06977", 0.81], ["0.06975", 0.053], ["0.06970", 0.022], ["0.06967", 0.531], ["0.06962", 0.017], ["0.06955", 0.004], ["0.06953", 0.002], ["0.06951", 0.031], ["0.06950", 10.0], ["0.06933", 0.301], ["0.06932", 0.606], ["0.06931", 0.022], ["0.06929", 0.015], ["0.06924", 2.48], ["0.06923", 0.5], ["0.06922", 0.2], ["0.06921", 0.5], ["0.06918", 0.03], ["0.06915", 0.001], ["0.06912", 0.069], ["0.06911", 0.002], ["0.06905", 0.003], ["0.06900", 20.39], ["0.06899", 0.002], ["0.06897", 0.242], ["0.06886", 0.808], ["0.06880", 0.026], ["0.06872", 1.0], ["0.06868", 0.005], ["0.06862", 0.584]],
      "isFrozen": "0",
      "postOnly": "0",
      "seq": 67767369
    }

    let res: any = [];
    processData(data.bids, "bids", true, res);
    processData(data.asks, "asks", false, res);
    xAxis.data.setAll(res);
    bidsTotalVolume.data.setAll(res);
    asksTotalVolume.data.setAll(res);
    bidVolume.data.setAll(res);
    asksVolume.data.setAll(res);

    function processData(list: any[], type: any, desc: any, res: any) {

      // Convert to data points
      for (var i = 0; i < list.length; i++) {
        list[i] = {
          value: Number(list[i][0]),
          volume: Number(list[i][1]),
        }
      }

      // Sort list just in case
      list.sort(function (a, b) {
        if (a.value > b.value) {
          return 1;
        }
        else if (a.value < b.value) {
          return -1;
        }
        else {
          return 0;
        }
      });

      // Calculate cummulative volume
      if (desc) {
        for (var i = list.length - 1; i >= 0; i--) {
          if (i < (list.length - 1)) {
            list[i].totalvolume = list[i + 1].totalvolume + list[i].volume;
          }
          else {
            list[i].totalvolume = list[i].volume;
          }
          let dp: any = {};
          dp["value"] = list[i].value;
          dp[type + "volume"] = list[i].volume;
          dp[type + "totalvolume"] = list[i].totalvolume;
          res.unshift(dp);
        }
      }
      else {
        for (var i = 0; i < list.length; i++) {
          if (i > 0) {
            list[i].totalvolume = list[i - 1].totalvolume + list[i].volume;
          }
          else {
            list[i].totalvolume = list[i].volume;
          }
          let dp: any = {};
          dp["value"] = list[i].value;
          dp[type + "volume"] = list[i].volume;
          dp[type + "totalvolume"] = list[i].totalvolume;
          res.push(dp);
        }
      }

    }
  }, []);


  return (
    <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
  );
}