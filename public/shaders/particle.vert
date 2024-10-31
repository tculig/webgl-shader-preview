      #version 300 es
      out float alpha;
      out vec2 texCoord0;
      out vec3 testColor;
      out vec3 screenPos;
      out float shadow;

      in vec4 InVertex;  
      in vec4 InTexCoord0;
      in float InShadow;

      uniform mat4 modelViewMatrix;
      uniform mat4 projMatrix;
            
      void main(void)
      {
       
		int index = int(InTexCoord0.x);
		float size  = InTexCoord0.y * 1.0; //2.725;
		float angle = InTexCoord0.z;
		alpha 	    = clamp( InTexCoord0.w, 0.0, 1.0 );	
		float size2 = InVertex.w * 1.0; //2.725;

		float aa = radians(angle);

		vec2 tc = vec2(0.0, 0.0);
		vec4 P = vec4(InVertex.xyz, 1.0);

        vec3 dirMV = vec3(  modelViewMatrix[0][2], 
                			modelViewMatrix[1][2], 
                			modelViewMatrix[2][2]);
       
        vec3 rotatedUp = vec3(sin(aa), -cos(aa), 0.0); 
        vec3 right = normalize(cross(dirMV, rotatedUp)); 
		vec3 up = normalize(cross(right, dirMV)); 

		vec4 V = vec4(0.0);
		if ( index == 0 ) { V = vec4( -right*size + up*size2, 0.0 ); tc+=vec2(0.0, 0.0); }
		if ( index == 1 ) { V = vec4(  right*size + up*size2, 0.0 ); tc+=vec2(1.0, 0.0); }
		if ( index == 2 ) { V = vec4(  right*size - up*size, 0.0 ); tc+=vec2(1.0, 1.0); }
		if ( index == 3 ) { V = vec4( -right*size - up*size, 0.0 ); tc+=vec2(0.0, 1.0); }
		P.xyz += V.xyz;

		gl_Position = projMatrix * modelViewMatrix * P;

		screenPos.xyz = gl_Position.xyz / gl_Position.w;
		screenPos.xyz = screenPos.xyz * 0.5 + 0.5;

		texCoord0.st = tc;

		shadow = InShadow;
      }