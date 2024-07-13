class CICDecimator {
    constructor(order, decimationFactor) {
      this.order = order;
      this.decimationFactor = decimationFactor;
      this.integratorState = Array(order).fill(0);
      this.combState = Array(order).fill(0);
      this.sampleCount = 0;
      this.lastOutput = 0;
    }
  
    process(sample) {
      // Integrator stage
      this.integratorState[0] += sample;
      for (let i = 1; i < this.order; i++) {
        this.integratorState[i] += this.integratorState[i - 1];
      }
  
      // Downsample
      this.sampleCount++;
      if (this.sampleCount < this.decimationFactor) {
        return null;
      }
      this.sampleCount = 0;
  
      // Comb stage
      let output = this.integratorState[this.order - 1];
      this.integratorState.fill(0);
      this.combState[0] = output - this.combState[0];
      for (let i = 1; i < this.order; i++) {
        this.combState[i] = this.combState[i - 1] - this.combState[i];
      }
      output = this.combState[this.order - 1];
      this.lastOutput = output;
  
      return output;
    }
  }
  
  module.exports = CICDecimator;
  