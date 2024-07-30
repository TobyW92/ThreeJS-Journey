        precision mediump float;

        uniform float uTime;
        uniform vec2 uFrequency;
        uniform vec3 uColor;
        uniform sampler2D uTexture;

        // varying float vRandom;
        // varying vec3 vColor;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            vec4 textureColor = texture2D(uTexture, vUv);
            textureColor.rgb *= vElevation * 2.0 + 0.75;
            // gl_FragColor = vec4(0, vRandom, 0, 1.0);
            // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            // gl_FragColor = vec4(uColor, 1.0);
            gl_FragColor = textureColor;
            
        }