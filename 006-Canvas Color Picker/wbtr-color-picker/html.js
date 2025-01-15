const html = `

		<div class="cpicker wrapper" data-id="cpicker">

			<div class="cpicker-box">
				<canvas class="cpicker-box-canvas" data-id="cpicker-box-canvas" width="271" height="271"></canvas>
				<span class="cpicker-box-thumb" data-id="cpicker-box-thumb"></span>
			</div>
			<div class="cpicker-gradient" data-id="cpicker-gradient">
				<canvas data-id="cpicker-gradient-canvas" width="271" height="32"></canvas>				
				<input data-id="cpicker-gradient-input" type="range" min="0.00" max="1.00" step="0.01">
			</div>
			<div class="cpicker-transparent">				
				<div class="overlay"></div>	
				<input data-id="cpicker-transparent-input" type="range" min="0.00" max="1.00" step="0.01">
			</div>

			<div class="cpicker-code">
				<select data-id="cpicker-code-type" class="cpicker-code-type">
					<option value="hex">hex</option>
					<option value="rgba">rgba</option>
					<option value="css">css</option>
				</select>
				<div class="cpicker-code-inputs">
					<div class="cpicker-code-input cpicker-code-hex">
						<input type="text" data-id="cpicker-code-hex-input" placeholder="#000000">
					</div>
					<div class="cpicker-code-input cpicker-code-rgba">
						<input type="number" data-id="cpicker-code-rgba-rinput" placeholder="255" step="1" min="0" max="255">
						<input type="number" data-id="cpicker-code-rgba-ginput" placeholder="255" step="1" min="0" max="255">
						<input type="number" data-id="cpicker-code-rgba-binput" placeholder="255" step="1" min="0" max="255">
						<input type="number" data-id="cpicker-code-rgba-ainput" placeholder="0.01" step="0.01" min="0" max="1">
					</div>
					<div class="cpicker-code-input cpicker-code-css show">
						<input type="text" data-id="cpicker-code-css-input" placeholder="rgba(255, 255, 255, 0.99)">
					</div>
				</div>
			</div>
		</div>

`;

export default html;
