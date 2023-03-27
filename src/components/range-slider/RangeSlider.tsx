import React, { useEffect, useRef, useState } from 'react';
import './RangeSlider.css'
import clsx from 'clsx';

import { Text } from '../text/Text';

const DATA_ACTIVE = 'data-active'

interface RangeSliderTestProps {
  id?: string
  value?: number | string
  className?: string
  max?: number
  min?: number
  initialValue?: number
}

const RangeSlider = (props: RangeSliderTestProps) => {
  const { id, max = 0, min = 0, initialValue } = props;
  const inputRef = useRef<HTMLInputElement>();
  const thumbRef = useRef<HTMLDivElement>();
  const rangeRef = useRef<HTMLDivElement>();
  const elementRef = useRef<HTMLDivElement>();
  const progressPercentRef = useRef<HTMLSpanElement>();
  const rangePercentRef = useRef<HTMLSpanElement>();
  const maxPercentRef = useRef<HTMLSpanElement>();
  const progressTextRef = useRef<HTMLSpanElement>();
  const maxTextRef = useRef<HTMLSpanElement>();

  const compMountRef = useRef(false);

  const [rangeValue, setRangeValue] = useState(0);
  const [progress, setProgress] = useState(10);

  const options = {
    max: 500,
    min: 0,
    value: 0,
    defaultValue: 0,
    step: 1,
    disabled: false,
    rangeSliderDisabled: false,
    thumbDisabled: false,
  };
  const value = { min: 0, max: 0 };
  let startPos = 0;
  let isDragging = false;

  useEffect(() => {
    progressPercentRef.current.style['flexBasis'] = `${progress + 4}%`
    progressTextRef.current.style['flexBasis'] = `${progress}%`
    maxTextRef.current.style['flexBasis'] = `${100 - progress}%`
    if (!compMountRef.current) {
      if (initialValue) {
        setValue(String(initialValue))
        setRangeValue(initialValue)
      }
      reset();

      addNodeEventListener(elementRef.current, 'pointerdown', (e: any) => {
        elementFocused(e);
      })

      addNodeEventListener(thumbRef.current, 'pointerdown', (e: any) => {
        initiateThumbDrag(e, thumbRef.current)
      })

      addNodeEventListener(rangeRef.current, 'pointerdown', e => { initiateRangeDrag(e) })

      addNodeEventListener(document, 'pointermove', e => {
        drag(e)
      })
      addNodeEventListener(document, 'pointerup', () => {
        if (isDragging) {
          removeNodeAttribute(thumbRef.current, DATA_ACTIVE)
          removeNodeAttribute(rangeRef.current, DATA_ACTIVE)
          isDragging = false;

        }
      })
      compMountRef.current = true;
    }
  }, [])

  const addNodeEventListener = (node: any, event: string, fn: (e: any) => void, isPointerEvent = true) => {
    node.addEventListener(event, fn, isPointerEvent ? { passive: false, capture: true } : {})
  }

  function initiateRangeDrag(e: any) {
    initiateDrag(e, rangeRef.current)
  }

  function drag(e: any) {
    if (isDragging) {
      const lastPos = currentPosition(e, rangeRef.current);
      const delta = lastPos - startPos;
      startPos = lastPos;

      setRangeValue(delta + Number(inputRef.current.value))

      setValue(String(delta + Number(inputRef.current.value)))
    }

  }

  function updateRange() {
    const elementBounds = elementRef.current.getBoundingClientRect();

    rangeRef.current.style['width'] = `${Number(inputRef.current.value) * elementBounds.width / max}px`;
    thumbRef.current.style['left'] = `${Number(inputRef.current.value) * elementBounds.width / max}px`;

    rangePercentRef.current.style['flexBasis'] = `${Number(inputRef.current.value) * 100 / max - progress + 5}%`
    maxPercentRef.current.style['flexBasis'] = `${100 - Number(inputRef.current.value) * 100 / max - progress + 10}%`
  }

  const reset = () => {
    rangeRef.current.style['width'] = '';
    setValue('');
  }

  const setValue = (newValue: string, forceSet = false, callback = true) => {
    const currentValue = inputRef.current?.value;
    inputRef.current.value = newValue || currentValue;
    updateRange();
  }

  const elementFocused = (e: any, repeat = true) => {
    const currPos = currentPosition(e, rangeRef.current)
    if (currPos >= value.min) {
      setValue(String(currPos), true, false)
      initiateThumbDrag(e, thumbRef.current)
    }
  }

  const initiateDrag = (e: any, node: HTMLElement) => {
    setNodeAttribute(node, DATA_ACTIVE)
    startPos = currentPosition(e, node)

    isDragging = true
  }

  const initiateThumbDrag = (e: any, node: HTMLElement) => {
    if (!options.disabled) {
      initiateDrag(e, node);
    }
  }

  const setNodeAttribute = (node: HTMLElement, attribute: string, value = '') => {
    node.setAttribute(attribute, value);
  }

  function removeNodeAttribute(node: HTMLElement, attribute: string) {
    node.removeAttribute(attribute)
  }


  const currentPosition = (e: any, node: HTMLElement) => {
    const elementBounds = elementRef.current.getBoundingClientRect();

    const currPos = (e[`clientX`] - elementBounds['left']) * max / elementBounds.width

    // console.group('---- current position ----');

    // console.log('currPos: ', currPos);
    // console.log('e clientX: ', e['clientX']);

    // console.groupEnd();
    return currPos;
  }

  return (
    <div>
      <div className='d-flex flex-row m-b-9'>
        <Text innerRef={progressPercentRef} className='range-slider-content'>10%</Text>
        <Text innerRef={rangePercentRef} className='range-slider-content'>{`${Number(inputRef.current?.value || 0) * 100 / max}%`}</Text>
        <Text innerRef={maxPercentRef} className='range-slider-content'>100%</Text>
      </div>
      <div className='range-slider-container'>
        <div data-testid='element' id={id} ref={elementRef} className={clsx('range-slider', props.className)}>
          <input
            ref={inputRef} type='range' min={options.min} max={max}
            step={options.step}
            // value={rangeValue} 
            // value={props.value ? options.value : (compMountRef.current ? value.max : options.defaultValue)} 
            onChange={() => { }}
            disabled
          />
          <div ref={thumbRef} role='slider' className='range-slider__thumb' data-upper >
            <div className='thumb-inner-circle'></div>
          </div>
          <div ref={rangeRef} className='range-slider__range' />
          <div className='range-slider__progress' />
        </div>
      </div>
      <div className='d-flex flex-row m-t-9'>
        <Text className='range-slider-content'>{`${min}`}</Text>
        <Text innerRef={progressTextRef} className='range-slider-content'>{progress * max / 100}</Text>
        <Text innerRef={maxTextRef} className='range-slider-content'>{max}</Text>
      </div>
    </div>
  );
}

export default RangeSlider;