// src/WebGLCanvas.js
import React, { useEffect, useRef } from 'react';
import { mat4 } from 'gl-matrix';

function WebGLCanvas(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');

    if (!gl) {
      console.error('WebGL 2 is not available.');
      return;
    }

    // Load and compile shaders, initialize buffers, and draw the scene
    // You can adapt your existing WebGL code here

    async function loadShaderSource(url) {
      const response = await fetch(url);
      return await response.text();
    }

    function compileShader(gl, source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
      const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Shader program linking failed:', gl.getProgramInfoLog(shaderProgram));
        return null;
      }
      return shaderProgram;
    }

    async function initWebGL() {
      const [vsSource, fsSource] = await Promise.all([
        loadShaderSource(process.env.PUBLIC_URL + '/shaders/particle.vert'),
        loadShaderSource(process.env.PUBLIC_URL + '/shaders/particle.frag'),
      ]);

      const shaderProgram = createShaderProgram(gl, vsSource, fsSource);

      if (!shaderProgram) return;

      // Get attribute and uniform locations
      const programInfo = {
        program: shaderProgram,
        attribLocations: {
          InVertex: gl.getAttribLocation(shaderProgram, 'InVertex'),
          // Add other attributes as needed
        },
        uniformLocations: {
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'modelViewMatrix'),
          projMatrix: gl.getUniformLocation(shaderProgram, 'projMatrix'),
          // Add other uniforms as needed
        },
      };

      // Initialize buffers and draw the scene
      const buffers = initBuffers(gl);
      drawScene(gl, programInfo, buffers);
    }

    function initBuffers(gl) {
      // Define your buffers here
      const positions = [
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
      ];

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      return {
        position: positionBuffer,
      };
    }

    function drawScene(gl, programInfo, buffers) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(programInfo.program);

      // Set up position attribute
      {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
          programInfo.attribLocations.InVertex,
          numComponents,
          type,
          normalize,
          stride,
          offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.InVertex);
      }

      // Set uniforms (e.g., modelViewMatrix, projMatrix)
      {
        const modelViewMatrix = mat4.create();
        const projMatrix = mat4.create();

        // Apply rotation and scale from props
        mat4.rotate(modelViewMatrix, modelViewMatrix, props.rotation * Math.PI / 180, [0, 1, 0]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [props.scale, props.scale, props.scale]);

        mat4.perspective(
          projMatrix,
          45 * Math.PI / 180,
          gl.canvas.clientWidth / gl.canvas.clientHeight,
          0.1,
          100.0
        );

        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projMatrix, false, projMatrix);
      }

      // Draw the scene
      {
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
      }
    }

    initWebGL();

    // Re-render when rotation or scale changes
  }, [props.rotation, props.scale]);

  return (
    <canvas ref={canvasRef} width={props.width} height={props.height} />
  );
}

export default WebGLCanvas;
