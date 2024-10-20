import { Effect, Layer, pipe } from "effect";
import { SVGEngine } from "./engine";
import { EF_SVGElement, EF_SVGElementType, EF_SVGAttributes } from "../core/types";
import { Environment } from "../environment/environment";
import { SVGEngineProvider } from "./engine.provider";
import { EnvironmentProvider } from "../environment/environment.provider";

class SVGEngineWrapper {
  private effect: Effect.Effect<EF_SVGElement, Error, Environment | SVGEngine>;

  constructor(effect: Effect.Effect<EF_SVGElement, Error, Environment | SVGEngine>) {
    this.effect = effect;
  }

  static fromEffect(effect: Effect.Effect<EF_SVGElement, Error, Environment | SVGEngine>): SVGEngineWrapper {
    return new SVGEngineWrapper(effect);
  }

  /**
   * @description 이전의 effect를 무시하고 새로운 effect를 생성
   */
  static importSVG(svgString: string): SVGEngineWrapper {
    return new SVGEngineWrapper(
      pipe(
        SVGEngine,
        Effect.flatMap((engine) => engine.importSVG(svgString))
      )
    );
  }

  static createElement(type: EF_SVGElementType, attributes: EF_SVGAttributes): SVGEngineWrapper {
    return new SVGEngineWrapper(
      pipe(
        SVGEngine,
        Effect.flatMap((engine) => engine.createElement(type, attributes))
      )
    );
  }

  setAttributes(attributes: EF_SVGAttributes): SVGEngineWrapper {
    this.effect = 
      pipe(
        this.effect,
        Effect.flatMap((element) => pipe(
          SVGEngine,
          Effect.flatMap((engine) => engine.setAttributes(element, attributes))
        ))
      )
      
    return this;
  }

  appendChild(child: SVGEngineWrapper): SVGEngineWrapper {
    this.effect = 
      pipe(
        this.effect,
        Effect.flatMap((element) => pipe(
          SVGEngine,
          Effect.flatMap((engine) => pipe(
            child.effect,
            Effect.flatMap((childElement) => engine.appendChild(element, childElement))
          ))
        ))
      )

    return this;
  }

  applyTransform(transform: string): SVGEngineWrapper {
    this.effect = 
      pipe(
        this.effect,
        Effect.flatMap((element) => pipe(
          SVGEngine,
          Effect.flatMap((engine) => engine.applyTransform(element, transform))
        ))
      )

    return this;
  }

  setStyle(style: string): SVGEngineWrapper {
    this.effect = 
      pipe(
        this.effect,
        Effect.flatMap((element) => pipe(
          SVGEngine,
          Effect.flatMap((engine) => engine.setStyle(element, style))
        ))
      )

    return this;
  }

  

  toEffect(): Effect.Effect<EF_SVGElement, Error, Environment | SVGEngine> {
    return this.effect;
  }

  render(): SVGEngineWithRunner<string, Error> {
    const program = pipe(
      this.effect,
      Effect.flatMap((element) => pipe(
        SVGEngine,
        Effect.flatMap((engine) => engine.render(element))
      ))
    );

    const runnable = new SVGEngineWithRunner(
      program,
      [EnvironmentProvider]
    );

    return runnable;
  }
}

class SVGEngineWithRunner<out A, out E = never> {
  private effect: Effect.Effect<A, E, SVGEngine | Environment>;
  private requirements: Layer.Layer<Environment, never>[];

  constructor(effect: Effect.Effect<A, E, SVGEngine | Environment>, requirements?: Layer.Layer<Environment, never>[]) {
    this.effect = effect;
    this.requirements = requirements || [];
  }

  provide(requirements: Layer.Layer<Environment, never>[]): SVGEngineWithRunner<A, E> {
    this.requirements = requirements;
    return this;
  }

  runPromise(): Promise<A> {
    const runnable = Effect.provide(this.effect, [
      SVGEngineProvider,
      ...this.requirements,
    ]);

    return Effect.runPromise(runnable);
  }

  runSync(): A {
    const runnable = Effect.provide(this.effect, [
      SVGEngineProvider,
      ...this.requirements,
    ]);

    return Effect.runSync(runnable);
  }

  toEffect(): Effect.Effect<A, E, SVGEngine | Environment> {
    return this.effect;
  }
}

export const SVG = SVGEngineWrapper;