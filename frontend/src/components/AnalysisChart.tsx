import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../styles/themes';

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
}

const labelTranslations: { [key: string]: string } = {
  positive: 'Положительный',
  negative: 'Отрицательный',
  neutral: 'Нейтральный',
  speech: 'Речь',
  skip: 'Пропуск'
};

const AnalysisChart: React.FC<Props> = ({ data }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const chartRef = useRef<HTMLDivElement>(null);

  const drawChart = () => {
    if (!data || !chartRef.current) return;

    // Очищаем предыдущий график
    d3.select(chartRef.current).selectAll('*').remove();

    // Изменяем размеры и отступы
    const margin = { 
      top: 20, 
      right: 100, 
      bottom: 120,  // Увеличиваем нижний отступ еще больше
      left: 150 
    };
    const width = 800 - margin.left - margin.right;  // увеличиваем общую ширину
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(data.map(d => labelTranslations[d.label] || d.label))
      .range([0, height])
      .padding(0.1);

    // Добавляем оси
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${(+d * 100)}%`))
      .selectAll('text')
      .style('font-family', "'Roboto', sans-serif")
      .style('font-size', '12px')
      .attr('dy', '1em');  // Добавляем отступ для меток оси

    svg.append('g')
      .call(d3.axisLeft(y));

    // Добавляем полосы
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('g');

    const rects = bars.append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(labelTranslations[d.label] || d.label) || 0)
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)  // начальная ширина 0
      .attr('fill', d => getBarColor(d.label));

    // Добавляем обработчики событий
    rects.on('mouseover', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 0.7);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1);
    });

    // Анимация отдельно
    rects.transition()
      .duration(800)
      .attr('width', d => x(d.value));

    // Добавляем значения в процентах
    bars.append('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.value) + 5)
      .attr('y', d => (y(labelTranslations[d.label] || d.label) || 0) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .style('font-weight', '700')  // Делаем текст жирным
      .style('font-size', '14px')   // Увеличиваем размер шрифта
      .style('font-family', "'Montserrat', sans-serif")  // Используем Montserrat для значений
      .text(d => `${(d.value * 100).toFixed(1)}%`);

    // После создания svg:
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', theme === 'dark' ? '#e0e0e0' : currentTheme.chart.text)
      .text('Анализ тональности текста');

    // Обновляем позицию подписи оси X
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 70)  // Увеличиваем расстояние от оси
      .attr('text-anchor', 'middle')
      .style('fill', theme === 'dark' ? '#e0e0e0' : currentTheme.text)
      .style('font-size', '14px')
      .style('font-family', "'Montserrat', sans-serif")
      .style('font-weight', '500')
  

    // Обновляем стили в соответствии с темой
    svg.selectAll('text')
      .style('fill', theme === 'dark' ? '#e0e0e0' : currentTheme.chart.text);

    svg.selectAll('.domain, .tick line')
      .style('stroke', theme === 'dark' ? '#404040' : currentTheme.chart.grid);
  };

  useEffect(() => {
    drawChart();
    
    const handleResize = () => {
      if (chartRef.current) {
        d3.select(chartRef.current).selectAll('*').remove();
        drawChart();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  const getBarColor = (label: string): string => {
    const colors: { [key: string]: string } = {
      positive: '#28a745',
      negative: '#dc3545',
      neutral: '#6c757d',
      speech: '#17a2b8',
      skip: '#ffc107'
    };
    return colors[label] || '#6c757d';
  };

  if (!data || data.length === 0) {
    return (
      <div 
        data-testid="empty-container"
        style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666' 
        }}
      >
        Нет данных для отображения
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: currentTheme.chart.background,
      textAlign: 'center',
      margin: '20px 0',
      color: '#666',
      fontSize: '16px'
    }}>
      <p>График показывает распределение эмоциональной окраски текста по категориям.</p>
      <p>Значения представлены в процентах от общего объема анализируемого текста.</p>
      <div 
        ref={chartRef}
        data-testid="chart-container" 
        className="chart-container"
        style={{ 
          width: '100%', 
          maxWidth: '800px',
          margin: '0 auto',
          height: '300px',
          padding: '20px'
        }}
      />
      <div className="chart-legend" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '20px',
        flexWrap: 'wrap',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {Object.entries(labelTranslations).map(([key, label]) => (
          <div key={key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: getBarColor(key),
              borderRadius: '4px'
            }} />
            <span style={{
              color: theme === 'dark' ? '#e0e0e0' : currentTheme.text
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisChart; 