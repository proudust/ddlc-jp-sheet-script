declare namespace google {
  namespace script {
    let run: Run<unknown, unknown>;
    interface Run<Return, User> {
      withSuccessHandler<R extends Return, U extends User>(
        callbackfn: (value: R, object: U) => void,
      ): Run<R, U>;

      withFailureHandler<U extends User>(
        callbackfn: (error: Error, object: U) => void,
      ): Run<Return, U>;

      withUserObject<U extends User>(object: U): Run<Return, U>;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: (...args: any[]) => void;
    }

    namespace host {
      function close(): void;
    }
  }
}
