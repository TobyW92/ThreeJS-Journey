uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);


    // Base Color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Initialize Light
    vec3 light = vec3(0.0);

    // Ambient Light
    light += ambientLight(
        vec3(1.0),  // Light Color
        0.25        // Light Intensity
    );

    // Directional Light
    // light += directionalLight(
    //     vec3(1.0),  // Light Color
    //     1.0,                  // Light Intensity
    //     normal,               // Normal
    //     vec3(-1.0, 0.5, 0.0),  // Light Position
    //     viewDirection,        // View Direction
    //     30.0                  // Specular Power
    // ); 

    light += pointLight(
        vec3(1.0),  // Light Color
        10.0,                  // Light Intensity
        normal,               // Normal
        vec3(0.0, 0.25, 0.0),  // Light Position
        viewDirection,        // View Direction
        30.0,                 // Specular Power
        vPosition,            // Position
        0.95                  // Light Decay
    );
    
    color *= light;

    // Final Color
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(normal, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}