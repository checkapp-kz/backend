import { Injectable } from '@nestjs/common';
import * as htmlPdf from 'html-pdf-node';
import { Test } from '../test.model';
import { MaleCheckupRecommendations } from '../interfaces/male-checkup.interface';

@Injectable()
export class PdfGeneratorService {
  async generateMaleCheckupPdf(
    test: Test,
    recommendations: MaleCheckupRecommendations,
  ): Promise<Buffer> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .header {
              text-align: center;
              color: #333;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              color: #2c3e50;
              border-bottom: 2px solid #3498db;
              padding-bottom: 5px;
            }
            .test-item {
              margin: 10px 0;
              padding-left: 20px;
            }
            .bmi-info {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Результаты медицинского чекапа</h1>
            <p>Дата: ${new Date().toLocaleDateString()}</p>
          </div>

          ${
            recommendations.bmi
              ? `
            <div class="bmi-info">
              <h2>Индекс массы тела (BMI)</h2>
              <p>Значение: ${recommendations.bmi.value.toFixed(1)}</p>
              <p>Категория: ${recommendations.bmi.category}</p>
            </div>
          `
              : ''
          }

          ${
            recommendations.basicTests.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Основные анализы</h2>
              ${recommendations.basicTests
                .map(
                  (test) => `
                <div class="test-item">• ${test}</div>
              `,
                )
                .join('')}
            </div>
          `
              : ''
          }

          ${
            recommendations.additionalTests.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Дополнительные анализы</h2>
              ${recommendations.additionalTests
                .map(
                  (test) => `
                <div class="test-item">• ${test}</div>
              `,
                )
                .join('')}
            </div>
          `
              : ''
          }

          ${
            recommendations.consultations.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Рекомендуемые консультации</h2>
              ${recommendations.consultations
                .map(
                  (consultation) => `
                <div class="test-item">• ${consultation}</div>
              `,
                )
                .join('')}
            </div>
          `
              : ''
          }
        </body>
      </html>
    `;

    const options = {
      format: 'A4',
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    const file = { content: html };
    return await htmlPdf.generatePdf(file, options);
  }
}
