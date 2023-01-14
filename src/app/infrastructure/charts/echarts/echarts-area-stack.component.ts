import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {SearchService} from "../../../api/services/search.service";
import {StackGraphDTO} from "../../../api/model/search.model";

@Component({
  selector: 'ngx-echarts-area-stack',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsAreaStackComponent implements AfterViewInit, OnDestroy, OnInit {
  options: any = {};
  themeSubscription: any;

  private data:StackGraphDTO;

  constructor(private theme: NbThemeService, private _searchService:SearchService) {
  }

  ngOnInit(): void {
    this._searchService.lastWeekHisotry().subscribe((data)=>{
      this.data=data;
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        const colors: any = config.variables;
        const echarts: any = config.variables.echarts;

        let series =[];
        for(let i=0; i<this.data.categories.length;i++){
          series.push(
            {
              name: this.data.categories[i],
              type: 'line',
              stack: 'Total researches',
              areaStyle: { normal: { opacity: echarts.areaOpacity } },
              data: this.data.y[i],
            }
          )
        }

        this.options = {
          backgroundColor: echarts.bg,
          color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: echarts.tooltipBackgroundColor,
              },
            },
          },
          legend: {
            data: this.data.categories,
            textStyle: {
              color: echarts.textColor,
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
              axisLabel: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
              splitLine: {
                lineStyle: {
                  color: echarts.splitLineColor,
                },
              },
              axisLabel: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
          ],
          series: series,
        };
      });
    });
    }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
