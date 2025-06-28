/**
 * 项目相关的工具方法
 * 用于处理项目数据的计算和格式化
 */

export default {
  /**
   * 修复浮点数精度问题
   * @param {Number} num - 需要修复精度的数字
   * @param {Number} decimals - 保留小数位数，默认2位
   * @returns {Number} 修复精度后的数字
   */
  fixFloatPrecision(num, decimals = 2) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * 计算入驻面积：所有入驻企业面积的总和
   * @param {Array} companies - 入驻企业数组
   * @returns {Number} 入驻面积总和
   */
  getOccupiedArea(companies) {
    if (!companies || companies.length === 0) {
      return 0;
    }
    const total = companies.reduce((total, company) => {
      return total + (Number(company.area) || 0);
    }, 0);
    // 修复浮点数精度问题
    return this.fixFloatPrecision(total);
  },

  /**
   * 计算可租面积：所有招租详情中空置面积的总和
   * @param {Array} rentalDetails - 招租详情数组
   * @returns {Number} 可租面积总和
   */
  getVacantArea(rentalDetails) {
    if (!rentalDetails || rentalDetails.length === 0) {
      return 0;
    }
    const total = rentalDetails.reduce((total, rental) => {
      return total + (Number(rental.vacantArea) || 0);
    }, 0);
    // 修复浮点数精度问题
    return this.fixFloatPrecision(total);
  },

  /**
   * 计算总招租面积：通过入驻面积+可租面积计算
   * @param {Object} projectData - 项目数据
   * @returns {Number} 总招租面积
   */
  getTotalLeasingArea(projectData) {
    // 通过入驻面积+可租面积计算总招租面积
    const occupiedArea = this.getOccupiedArea(projectData.companies);
    const vacantArea = this.getVacantArea(projectData.rentalDetails);
    const total = occupiedArea + vacantArea;
    // 修复浮点数精度问题
    return this.fixFloatPrecision(total);
  },

  /**
   * 计算空置率：可租面积 / (入驻面积 + 可租面积) * 100
   * @param {Array} companies - 入驻企业数组
   * @param {Array} rentalDetails - 招租详情数组
   * @returns {String} 空置率百分比（保留1位小数）
   */
  getVacancyRate(companies, rentalDetails) {
    const occupiedArea = this.getOccupiedArea(companies);
    const vacantArea = this.getVacantArea(rentalDetails);
    const totalArea = occupiedArea + vacantArea;
    
    if (totalArea === 0) return '0.0';
    
    // 计算空置率并修复精度问题
    const rate = (vacantArea / totalArea * 100);
    const fixedRate = this.fixFloatPrecision(rate, 1);
    return fixedRate.toFixed(1);
  },

  /**
   * 格式化数字显示（用于界面显示）
   * @param {Number} num - 要格式化的数字
   * @param {Number} decimals - 保留小数位数，默认2位
   * @returns {String} 格式化后的数字字符串
   */
  formatNumber(num, decimals = 2) {
    if (num === 0) return '0';
    const fixedNum = this.fixFloatPrecision(num, decimals);
    return fixedNum.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  }
} 