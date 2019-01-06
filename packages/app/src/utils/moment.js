import momentTimezone from 'moment-timezone';
import _ from 'lodash';

export const getTimezones = () => {
  const timeZones = momentTimezone.tz.names();
  const offsetTmz = [];

  Object.keys(timeZones).forEach(key => {
    const tz = momentTimezone
      .tz(timeZones[key])
      .format('Z')
      .replace(':00', '')
      .replace(':30', '.5');
    const x = tz === 0 ? 0 : parseInt(tz, 10).toFixed(2);

    const timeZone = {
      label: `(GMT${momentTimezone.tz(timeZones[key]).format('Z')}) ${
        timeZones[key]
      }`,
      value: `${timeZones[key]}`,
      time: `${x}`,
    };
    offsetTmz.push(timeZone);
  });

  return _.sortBy(offsetTmz, [el => +el.time]);
};
