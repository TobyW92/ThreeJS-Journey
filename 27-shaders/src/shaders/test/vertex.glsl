        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;
        uniform float uTime;
        uniform vec2 uFrequency;
        // uniform vec3 uColor;
        
        attribute vec3 position;
        attribute float aRandom;
        attribute vec2 uv;

        // varying float vRandom;
        // varying vec3 vColor;
        varying vec2 vUv;
        varying float vElevation;

        void main() {

            vUv = uv;

            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
            elevation += modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

            vElevation = elevation;

            modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
            modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;

            gl_Position = projectedPosition;
            // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }