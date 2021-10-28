import axios from 'axios';
export default class APIModule {
  private API_KEY: string = '';
  constructor() {
    this.API_KEY = process.env.VUE_APP_API_WEATHER_KEY;
  }
  /**
   * getWeatherByCords
   */
  public setApiKey(key: string) {
    if (key.length > 1) {
      this.API_KEY = key;
    }
  }
  public async getWeatherByCords(location: string) {
    const cords = location.split(':');
    const latitude = cords[0];
    const longitude = cords[1];
    // tslint:disable-next-line:no-console
    console.log('latitude:', latitude, 'longitude:', longitude);
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat='
        + latitude + '&lon=' + longitude + '&appid=' + this.API_KEY);
      // tslint:disable-next-line:no-console
      console.log(response.data);
      return response.data;
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
      return null;
    }
  }
  public async getWeatherByName(location: string) {
    // tslint:disable-next-line:no-console
    console.log(location);
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q='
        + location + '&appid=' + this.API_KEY);
      // tslint:disable-next-line:no-console
      console.log(response.data);
      return response.data;
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
      return null;
    }
  }
}



