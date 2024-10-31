      #version 300 es
      precision mediump float;
      precision mediump int;
      // tex0, tex1, tex2, tex3
      in float alpha;
      in vec2 texCoord0;
      in vec3 testColor;
      in vec3 screenPos;
      in float shadow;

      out vec4 fragColor;
      uniform vec4 lightDir;
      uniform vec4 lightColorNew;
            
      void main(void)
      {
        //vec4 color = textureLod(tex0, texCoord0.st, 4.5 - alpha*3.0).rgba;
        //fragColor = vec4(color.rgb, alpha);
        //return;
        //color.a *= 0.85;

        //if ( color.a == 0 ) {
        //	discard;
        //}

  //vec4 color = textureLod(tex0, texCoord0.st, 4.5 - alpha*3.0).rgba
  //vec4 color = textureLod(tex0, texCoord0.st, 3.0).rgba;
  vec4 color = texture(tex0, texCoord0.st).rgba;
  color.rgb = vec3(0.0, 1.0, 0.0);
	vec3 N = normalize(2.0 * color.rgb - 1.0);
	//vec3 lightDir = vec3(-0.25, -0.5, -0.025);
	//vec3 lightDir = vec3(0, -1.0, -0.025);
	
	//float d = dot(N.rgb, normalize(lightDir.xyz));// * 0.5 + 0.5;
	//float d = max(dot(N.rgb, -normalize(lightDir))+0.35, 0.0) / (1.0 + 0.35) + 0.25;
	
	vec3 L = normalize(-lightDir.xyz);
	//L.z *= -1.0;
  //L.y *= -1.0;
	//L.x *= -1.0;
  //L.y *= -1.0;
  float fAreaSize = 0.25;
	float d = max( dot(N, L) + fAreaSize, 0.0 ) / (1.0 + fAreaSize);

	vec3 backlight = lightColorNew.rgb * max(dot(N, -L), 0.0) * 0.25; //5; // * 0.1 * 0.3;

  fragColor.rgb = vec3(max(d, 0.0)) * lightColorNew.rgb * 0.5;// * lightColorNew.a;// * 0.2;
  fragColor.rgb += backlight;
  fragColor.rgb *= min(shadow + 0.04, 1.0);
	//fragColor.rgb += vec3(0.8, 0.23, 0.15) * 1.6; // was 2.5


	fragColor.a = min(color.a * color.a * alpha * 1.75 * 1.8, 1.0);
	//return;


	float sceneDepth = texture(tex3, screenPos.xy).r;
  float particleDepth = gl_FragCoord.z;
  float softAlpha = clamp( (sceneDepth - particleDepth) / 0.0005, 0.0, 1.0);
  //fragColor.a *= softAlpha;

  // float ContrastPower = 2.0;
  // float Input = (sceneDepth - particleDepth) / 0.000125;
  //   float Output = 0.5 * pow( clamp( 2.0*(( Input > 0.5) ? 1.0-Input : Input), 0.0, 1.0 ), ContrastPower);

  //   float weight = ( Input > 0.5) ? 1.0-Output : Output;
    //fragColor.a *= weight;
    //return;
	//color.rgb = sqrt(color.rgb / 8.0);

	//color.rgb = vec3(120.5, 71.5, 1.5);
	//color.rgb = vec3(1.0, 0.02, 0.25); //testColor.rgb;
	//color.a = alpha;

	//color.a = 1.0;

	//fragColor = color;
      }