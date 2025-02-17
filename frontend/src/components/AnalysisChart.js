import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AnalysisChart = ({ data }) => {
  const svgRef = useRef();

  // Проверка наличия данных
  if (!data) {
    return <div>Нет данных для отображения</div>;
  }

  // Функция для интерпретации результатов
  const interpretResults = (data) => {
    if (!data || typeof data !== 'object') return 'неопределенный';

    const maxValue = Math.max(...Object.values(data));
    const mainEmotion = Object.entries(data).find(([_, value]) => value === maxValue);
    
    if (!mainEmotion) return 'неопределенный';

    const [emotion, value] = mainEmotion;
    const percentage = (value * 100).toFixed(1);

    const interpretations = {
      positive: `ярко выраженный позитивный (${percentage}%)`,
      negative: `ярко выраженный негативный (${percentage}%)`,
      neutral: `преимущественно нейтральный (${percentage}%)`,
      speech: `разговорный стиль (${percentage}%)`,
      skip: `неопределенный (${percentage}%)`
    };

    return interpretations[emotion] || 'неопределенный';
  };

  // Функция для определения значимости
  const isSignificant = (value) => value > 0.01; // 1%

  // Функция для форматирования значений
  const formatValue = (value) => {
    if (value < 0.0001) {
      return '< 0.01%';
    }
    return (value * 100).toFixed(1) + '%';
  };

  useEffect(() => {
    if (!data || typeof data !== 'object') return;

    // Фильтруем значения меньше 1%
    const significantData = Object.entries(data)
      .filter(([_, value]) => isSignificant(value))
      .map(([key, value]) => ({
        category: key,
        value: value
      }))
      .sort((a, b) => b.value - a.value); // Сортируем по убыванию

    // Очищаем предыдущий график
    d3.select(svgRef.current).selectAll('*').remove();

    // Размеры графика
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Создаем SVG контейнер
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Шкалы
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([height, 0]);

    // Устанавливаем домены
    x.domain(significantData.map(d => d.category));
    y.domain([0, d3.max(significantData, d => d.value)]);

    // Цветовая схема
    const color = d3.scaleOrdinal()
      .domain(['positive', 'negative', 'neutral', 'speech', 'skip'])
      .range(['#28a745', '#dc3545', '#6c757d', '#17a2b8', '#ffc107']);

    // Добавляем оси
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5, '%'));

    // Добавляем столбцы
    const bars = svg.selectAll('.bar')
      .data(significantData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
      .attr('fill', d => color(d.category));

    // Добавляем значения над столбцами
    svg.selectAll('.value-label')
      .data(significantData)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.category) + x.bandwidth()/2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text(d => formatValue(d.value));

    // Обновляем интерпретацию
    svg.append('text')
      .attr('class', 'interpretation')
      .attr('x', width/2)
      .attr('y', -margin.top/2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(`Тональность текста: ${interpretResults(data)}`);

  }, [data]);

  const getEmotionDescription = (emotion, value) => {
    const percentage = (value * 100).toFixed(1);
    const descriptions = {
      positive: 'Позитивная оценка',
      negative: 'Негативная оценка',
      neutral: 'Нейтральная оценка',
      speech: 'Речевые особенности',
      skip: 'Пропущенные элементы'
    };
    return `${descriptions[emotion]}: ${percentage}%`;
  };

  // Проверяем, что data существует и является объектом
  const analysisData = data && typeof data === 'object' ? data : {};

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
      <div className="analysis-summary">
        <h3>Подробный анализ:</h3>
        {Object.entries(analysisData)
          .sort((a, b) => b[1] - a[1])
          .map(([emotion, value]) => (
            <div key={emotion} className={`summary-item ${emotion} ${isSignificant(value) ? 'significant' : ''}`}>
              <span className="legend-color" style={{backgroundColor: getEmotionColor(emotion)}}></span>
              <span className="emotion-description">{getEmotionDescription(emotion, value)}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

// Функция для получения цвета эмоции
const getEmotionColor = (emotion) => {
  const colors = {
    positive: '#28a745',
    negative: '#dc3545',
    neutral: '#6c757d',
    speech: '#17a2b8',
    skip: '#ffc107'
  };
  return colors[emotion] || '#6c757d';
};

export default AnalysisChart; 