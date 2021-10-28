<template>
  <div class="weather container">
    <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-3">
        <div v-if="countWeathers === 0 || showSettings == true">
          <div v-if="showSettings == true" class="row">
              <div class="col-6 text-start">
                <h2>Settings</h2>
              </div>
              <div class="col-6 text-end">
                <a href="#" class="link-info" v-on:click="togleSettings">Close</a>
              </div>
            </div>
          <label for="manual-location-enter" class="form-label">Enter location:</label>
          <div class="input-group">
            <input type="text" class="form-control" id="manual-location-enter" placeholder="Your location" v-model="location">
            <button :disabled='!autoLocationSatus' class="btn btn-primary" type="button" v-on:click="setLocation">Set</button>
            <button :disabled='!autoLocationSatus' class="btn btn-info" type="button" v-on:click="getAutoLocation">Auto</button>
          </div>
          <div v-if="countWeathers !== 0">
            <div class="row" v-for="(weather, index) in weathers" :key="index+'-settings'">
              <div class="col-6 text-start">{{weather.name}}, {{weather.sys.country}}</div>
              <div class="col-6 text-end"><a href="#" class="link-info" v-on:click="deleteWeather(index)">Delete</a></div>
              <br>
            </div>
          </div>
        </div>
        <div v-if="showWeather">
          <div class="row">
            <div class="col-12 text-end">
                <a href="#" class="link-info" v-on:click="togleSettings">Settings</a>
              </div>
          </div>
          <div v-for="(weather, index) in weathers" :key="index">
            <div class="row">
              <div class="col-6 text-start">{{weather.name}}, {{weather.sys.country}}</div>
            </div>
            <div class="row">
              <div class="col-6 text-start"> <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"></div>
              <div class="col-6 text-center"><h1>{{getCelsiusFromKelvin(weather.main.temp)}} °C</h1></div>
            </div>
            <div class="text-start">
              Feel like {{getCelsiusFromKelvin(weather.main.feels_like)}}°C {{weather.weather[0].main}}, {{weather.weather[0].description}}.
            </div>

            <div class="text-start">Wind:  {{weather.wind.speed.toFixed(1)}} m/s with gust {{weather.wind.gust.toFixed(1)}} m/s
              with {{getDirection(weather.wind.deg)}} direction
              </div>
            <div class="text-start">Pressure:  {{weather.main.pressure}}hPa</div>
            <div class="text-start">Humidity:  {{weather.main.humidity}}%</div>

            <div class="text-start">Visibility {{formateSize(weather.visibility)}}</div>
            <hr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import WeatherAPI from '../utils/WeatherAPI';

@Component
export default class Weathers extends Vue {
  @Prop() private api!: string;
  private location: string = '';
  private weatherAPI = new WeatherAPI();
  private weathers: Record<string, any> = {};
  // private weather: any = null;
  private autoLocationSatus: boolean = true;
  private showSettings: boolean = false;

  private mounted() {
    if (this.$props.api && this.$props.api.length > 1) {
      this.weatherAPI.setApiKey(this.api);
    }
  }

  get countWeathers() {
    return Object.keys(this.weathers).length;
  }
  get showWeather() {
    if (this.countWeathers > 0 && this.showSettings === false) {
      return true;
    }
    return false;
  }
  private addWeather(id: string, item: any) {
    this.$set(this.weathers, id, item);
  }
  private deleteWeather(id: string) {
    this.$delete(this.weathers, id);
  }

  private async setLocation() {
    if (this.location.length > 1) {
      // tslint:disable-next-line:no-console
      console.log(this.location);
      const weather = await this.weatherAPI.getWeatherByName(this.location);
      this.addWeather(this.location, weather);
      this.location = '';
    }
  }

  private async getAutoLocation() {
    this.autoLocationSatus = false;
    navigator.geolocation.getCurrentPosition(async (lock) => {
      const location = lock.coords.latitude + ':' + lock.coords.longitude;
      const weather = await this.weatherAPI.getWeatherByCords(location);
      this.addWeather(location, weather);
      this.autoLocationSatus = true;
    });
  }

  private getCelsiusFromKelvin(amount: number) {
    return (amount - 273.15).toFixed(1);
  }
  private formateSize(amount: number) {
    if (amount > 1000) {
      return (amount / 1000).toFixed(2) + ' km';
    } else {
      return amount + ' km';
    }
  }
  private getDirection(angle: number) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE',
      'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.floor((angle / 22.5) + 0.5);
    return directions[(index % 16)];
  }
  private togleSettings() {
    this.showSettings = !this.showSettings;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "~bootstrap/scss/bootstrap";
</style>
