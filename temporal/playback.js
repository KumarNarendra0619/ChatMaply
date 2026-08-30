// BUILD-11: temporal playback controller for map layers.

export class TemporalPlayback {
  constructor({ records = [], onChange = () => {} } = {}) {
    this.records = [...records].filter(r => Number.isFinite(r.time_value));
    this.records.sort((a,b) => a.time_value - b.time_value);
    this.onChange = onChange;
    this.index = 0;
    this.playing = false;
    this.timer = null;
  }

  setRecords(records = []) { this.records = [...records].filter(r => Number.isFinite(r.time_value)).sort((a,b) => a.time_value - b.time_value); this.index = 0; this.emit(); }
  current() { return this.records[this.index] || null; }
  emit() { this.onChange({ index: this.index, total: this.records.length, current: this.current(), records: this.records.slice(0, this.index + 1) }); }
  step(delta = 1) { if (!this.records.length) return; this.index = Math.max(0, Math.min(this.records.length - 1, this.index + delta)); this.emit(); }
  play(interval = 900) { if (this.playing || !this.records.length) return; this.playing = true; this.timer = setInterval(() => { if (this.index >= this.records.length - 1) this.pause(); else this.step(1); }, interval); this.emit(); }
  pause() { this.playing = false; if (this.timer) clearInterval(this.timer); this.timer = null; this.emit(); }
  reset() { this.pause(); this.index = 0; this.emit(); }
}
