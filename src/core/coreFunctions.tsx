import React from 'react';
import { SwiperSlide } from 'swiper/react';
import { Badge } from '../entities/badge';
import store from '../store/store';
import { toast } from 'react-toastify';
import { appActionTypes } from '../store/actions/appActions';

export const RenderSlides = (items, rows, columns) => {
  let row = [];
  let slide = [];
  let slides = [];
  for (const index in items) {
    if (items.hasOwnProperty(index)) {
      if (+index % columns === 0 && row.length) {
        slide.push(<div key={slide.length} className='row'>{row}</div>);
        row = [];
      }
      if (+index % (rows * columns) === 0 && slide.length) {
        slides.push(<SwiperSlide key={slides.length}>
          <div className='modal_content__slider_slide-container'>
            {slide}
          </div>
        </SwiperSlide>);
        slide = [];
      }
      row.push(items[index]);
    }
  }
  if (row.length) {
    slide.push(<div key={slide.length} className='row'>{row}</div>);
  }
  if (slide.length) {
    slides.push(<SwiperSlide key={slides.length}>
      <div className='modal_content__slider_slide-container'>
        {slide}
      </div>
    </SwiperSlide>);
  }
  return slides;
};

//если в бейдже в условиях есть подбейжи
//смотрим все подбейджи
//если есть хоть один активный подБейдж, то делаем активным и сам бейдж
export const getBadgeIsDisable = (badge: Badge, unavailableBadges, badges): boolean => {
  let is_group_badge = false;
  let is_disabled = null;
  //если в бейдже в условиях есть подбейжи
  if (badge.conditions && badge.conditions.length) {
    for (const condition of badge.conditions) {
      if (condition.type === 'user' && condition.filters && condition.filters.length) {
        for (const filter of condition.filters) {
          if (filter.field === 'user.badges' && filter.operator === 'eq' && filter.values && filter.values.length) {
            if (is_disabled === null) {
              is_disabled = true;
            }
            for (const value of filter.values) {
              if (value && value.length) {
                is_group_badge = true;
                //смотрим все подбейджи
                for (let subBadge of value) {
                  //если есть хоть один активный подБейдж, то делаем активным и сам бейдж
                  subBadge = badges.find(i => i.id === subBadge);
                  if (subBadge) {
                    subBadge.is_disabled = getBadgeIsDisable(subBadge, unavailableBadges, badges);
                    if (!subBadge.is_disabled) {
                      is_disabled = false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  badge.is_group_badge = is_group_badge;
  if (is_disabled === null) {
    is_disabled = unavailableBadges.includes(badge.id);
  }

  return is_disabled;
};

/**
 count - количество выполненных условий
 from - количество условий
 progress - прогресс в виде десятичной дроби, например 0.4 (40%)
 is_completed - выполнено ли условие
 */

export const getProgress = (badgeId, apiState?): { count: number, from: number, progress: number, isCompleted: boolean } => {
  let badge;
  if (!apiState) {
    apiState = store.getState().apiReducer;
  }
  badge = apiState.config.badges.find(i => i.id === badgeId);
  if (!badge) {
    return { count: 0, from: 0, progress: 0, isCompleted: false };
  }
  let progress = 0;
  const countConditions = badge.conditions.length;
  if (badge.is_group_badge) {
    badge.conditions.map(condition => {
      if (condition.type === 'user') {
        condition.filters.map(filter => {
          if (filter.field === 'user.badges' && filter.operator === 'eq' && filter.values?.length === 1) {
            const value = filter.values?.[0]?.[0];
            const result = getProgress(value, apiState);
            if (result.isCompleted) {
              progress++;
            }
          }
        });
      }
    });
    return {
      count: progress,
      from: countConditions,
      isCompleted: progress >= countConditions,
      progress: progress / countConditions,
    };

  } else {
    const data = apiState.user.badge_progress[badge.id] || false;
    return {
      count: data.conditions_completed || 0,
      from: data.conditions?.length || 0,
      isCompleted: data.completed,
      progress: data.progress,
    };
  }

};


export const getClassList = (initClass, current) => {
  const setHeight = (selector) => {
    let elements = current.querySelectorAll(selector);
    let offsetHeight = 0;
    elements.forEach(elem => {
      if (elem.innerText && elem.offsetHeight > offsetHeight) {
        offsetHeight = elem.offsetHeight;
      }
    });
    elements.forEach(elem => {
      elem.style.height = offsetHeight + 'px';
    });
  };

  const classList = [initClass];
  if (current) {
    setHeight('.badge .badge__name');
    setHeight('.badge .badge__description');
    setHeight('.badge .badge__price');
  }

  return classList;
};

export const createNotify = (component, options = null) => {
  console.log('createNotify');
  const id = toast(component, options);
  store.dispatch({
    type: appActionTypes.NOTIFY_COUNT,
    count: 1,
  });
  return id;
};
export const closeNotify = (toastId) => {
  toast.dismiss(toastId);
  store.dispatch({
    type: appActionTypes.NOTIFY_COUNT,
    count: -1,
  });
};
export const closeAllNotify = () => {
  toast.dismiss();
  store.dispatch({
    type: appActionTypes.NOTIFY_COUNT,
    count: -store.getState().appReducer.notifyCount,
  });
};