import { useEffect, useState } from 'react';
import { css } from 'styled-components';

const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  xLarge: 1200,
};

const mq = Object.keys(breakpoints).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${breakpoints[label] / 16}em) {
      ${css(...args)}
    }
  `;

  return acc;
}, {});

const useMedia = (query, defaultState) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (!mounted) return;
      setState(!!mql.matches);
    };

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query]);

  return state;
};

export const useMediaMin = (bp, defaultState) =>
  useMedia(`(min-width: ${breakpoints[bp]}px)`, defaultState);

export const useMediaMax = (bp, defaultState) =>
  useMedia(`(max-width: ${breakpoints[bp] - 1}px)`, defaultState);

export default mq;
